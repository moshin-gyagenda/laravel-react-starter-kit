<?php

namespace App\Http\Controllers;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Inventory;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the purchase orders.
     */
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with(['customer:id,first_name,last_name,company_name', 'user:id,name'])
            ->select('id', 'po_number', 'customer_id', 'user_id', 'order_date', 'total_amount', 'payment_status', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('purchase-orders/index', [
            'purchaseOrders' => $purchaseOrders
        ]);
    }

    /**
     * Show the form for creating a new purchase order.
     */
    public function create()
    {
        $customers = Customer::select('id', 'first_name', 'last_name', 'company_name', 'email', 'phone', 'location')->get();
        $inventories = Inventory::select('id', 'name', 'packaging_type', 'selling_price', 'cost_price', 'quantity', 'status')->get();

        return Inertia::render('purchase-orders/create', [
            'customers' => $customers,
            'inventories' => $inventories,
        ]);
    }

    /**
     * Store a newly created purchase order in storage.
     */
  public function store(Request $request)
{
    // Remove the dd() statement to allow execution to continue
    // dd($request->all());
    
    // Validate the request data
    $validated = $request->validate([
        'po_number' => 'required|string|unique:purchase_orders,po_number',
        'customer_id' => 'required|exists:customers,id',
        'order_date' => 'required',
        'payment_terms' => 'nullable|string',
        'payment_status' => 'required|in:unpaid,partially_paid,paid',
        'subtotal' => 'required|numeric|min:0',
        'tax_amount' => 'required|numeric|min:0',
        'shipping_cost' => 'required|numeric|min:0',
        'discount_amount' => 'required|numeric|min:0',
        'total_amount' => 'required|numeric|min:0',
        'items' => 'required|array|min:1',
        'items.*.inventory_id' => 'required|exists:inventories,id',
        'items.*.quantity' => 'required|numeric|min:0.01',
        'items.*.unit' => 'required|string',
        'items.*.unit_price' => 'required|numeric|min:0',
        'items.*.tax_rate' => 'required|numeric|min:0',
        'items.*.tax_amount' => 'required|numeric|min:0',
        'items.*.discount_rate' => 'required|numeric|min:0',
        'items.*.discount_amount' => 'required|numeric|min:0',
        'items.*.subtotal' => 'required|numeric|min:0',
        'items.*.total' => 'required|numeric|min:0',
    ]);
   
    // Begin a transaction
    DB::beginTransaction();
    try {
        // Create the purchase order
        $purchaseOrder = new PurchaseOrder();
        $purchaseOrder->po_number = $request->input('po_number');
        $purchaseOrder->user_id = auth()->id();
        $purchaseOrder->customer_id = $request->input('customer_id');
        $purchaseOrder->order_date = $request->input('order_date');
        $purchaseOrder->payment_terms = $request->input('payment_terms');
        $purchaseOrder->payment_status = $request->input('payment_status');
        $purchaseOrder->subtotal = $request->input('subtotal');
        $purchaseOrder->tax_amount = $request->input('tax_amount');
        $purchaseOrder->shipping_cost = $request->input('shipping_cost', 0);
        $purchaseOrder->discount_amount = $request->input('discount_amount');
        $purchaseOrder->total_amount = $request->input('total_amount');
        $purchaseOrder->amount_paid = 0; // Set initial amount paid to 0
        $purchaseOrder->balance_due = $request->input('total_amount'); // Initial balance due equals total amount
        $purchaseOrder->save();

        // Log the created purchase order
        \Log::info('Created purchase order:', ['id' => $purchaseOrder->id]);

        // Create the purchase order items
        $items = $request->input('items', []);
        \Log::info('Processing items:', ['count' => count($items)]);
        
        foreach ($items as $index => $item) {
            $orderItem = new PurchaseOrderItem();
            $orderItem->purchase_order_id = $purchaseOrder->id;
            $orderItem->inventory_id = $item['inventory_id'];
            $orderItem->quantity = $item['quantity'];
            $orderItem->unit = $item['unit'];
            $orderItem->unit_price = $item['unit_price'];
            $orderItem->tax_rate = $item['tax_rate'];
            $orderItem->tax_amount = $item['tax_amount'];
            $orderItem->discount_rate = $item['discount_rate'];
            $orderItem->discount_amount = $item['discount_amount'];
            $orderItem->subtotal = $item['subtotal'];
            $orderItem->total = $item['total'];
            $orderItem->save();
            
            \Log::info('Created order item:', [
                'index' => $index,
                'id' => $orderItem->id,
                'inventory_id' => $item['inventory_id']
            ]);
        }

        // Commit the transaction
        DB::commit();
        \Log::info('Purchase order created successfully', ['id' => $purchaseOrder->id]);

        // Redirect with success message
        return redirect()->route('purchase-orders.index')
            ->with('success', 'Purchase order created successfully.');
    } catch (\Exception $e) {
        // Roll back the transaction in case of an error
        DB::rollBack();
        
        // Log the error
        \Log::error('Failed to create purchase order: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);

        // Return with error message
        return redirect()->back()
            ->withInput()
            ->with('error', 'Failed to create purchase order: ' . $e->getMessage());
    }
}
    /**
     * Display the specified purchase order.
     */
    public function show(PurchaseOrder $purchaseOrder)
    {
        // Load the purchase order with all its relationships
        $purchaseOrder->load([
            'customer',
            'user',
            'items.inventory', // Load items with their inventory details
        ]);
        
        // Get all payments related to this purchase order
        $payments = Payment::where('purchase_order_id', $purchaseOrder->id)
            ->orderBy('payment_date', 'desc')
            ->get();
        
        // Return the Inertia view with the purchase order and payments data
        return Inertia::render('purchase-orders/show', [
            'purchaseOrder' => $purchaseOrder,
            'payments' => $payments
        ]);
    }

    /**
     * Show the form for editing the specified purchase order.
     */
    public function edit($id)
    {
        $purchaseOrder = PurchaseOrder::with([
            'items.inventory:id,name,packaging_type,selling_price,quantity,status'
        ])->findOrFail($id);

        $customers = Customer::select('id', 'first_name', 'last_name', 'company_name', 'email', 'phone', 'location')->get();
        $inventories = Inventory::select('id', 'name', 'packaging_type', 'selling_price', 'cost_price', 'quantity', 'status')->get();

        return Inertia::render('purchase-orders/edit', [
            'purchaseOrder' => $purchaseOrder,
            'customers' => $customers,
            'inventories' => $inventories,
        ]);
    }

    /**
     * Update the specified purchase order in storage.
     */
    public function update(Request $request, PurchaseOrder $purchaseOrder)
  {
      // Validate the request data
      $validated = $request->validate([
          'po_number' => 'required|string|max:255',
          'customer_id' => 'required|exists:customers,id',
          'order_date' => 'required|date',
          'payment_terms' => 'required|string|max:255',
          'payment_status' => 'required|string|in:unpaid,partially_paid,paid',
          'subtotal' => 'required|numeric|min:0',
          'tax_amount' => 'required|numeric|min:0',
          'shipping_cost' => 'required|numeric|min:0',
          'discount_amount' => 'required|numeric|min:0',
          'total_amount' => 'required|numeric|min:0',
          'items' => 'required|array|min:1',
          'items.*.inventory_id' => 'required|exists:inventories,id',
          'items.*.quantity' => 'required|numeric|min:0.01',
          'items.*.unit' => 'required|string|max:50',
          'items.*.unit_price' => 'required|numeric|min:0',
          'items.*.tax_rate' => 'required|numeric|min:0',
          'items.*.tax_amount' => 'required|numeric|min:0',
          'items.*.discount_rate' => 'required|numeric|min:0',
          'items.*.discount_amount' => 'required|numeric|min:0',
          'items.*.subtotal' => 'required|numeric|min:0',
          'items.*.total' => 'required|numeric|min:0',
      ]);
      
      // Begin database transaction
      DB::beginTransaction();
      
      try {
          // Store the original total amount for comparison
          $originalTotalAmount = $purchaseOrder->total_amount;
          $amountPaid = $purchaseOrder->amount_paid;
          
          // Update the purchase order
          $purchaseOrder->po_number = $validated['po_number'];
          $purchaseOrder->customer_id = $validated['customer_id'];
          $purchaseOrder->order_date = $validated['order_date'];
          $purchaseOrder->payment_terms = $validated['payment_terms'];
          $purchaseOrder->payment_status = $validated['payment_status'];
          $purchaseOrder->subtotal = $validated['subtotal'];
          $purchaseOrder->tax_amount = $validated['tax_amount'];
          $purchaseOrder->shipping_cost = $validated['shipping_cost'];
          $purchaseOrder->discount_amount = $validated['discount_amount'];
          $purchaseOrder->total_amount = $validated['total_amount'];
          
          // Recalculate balance due based on the new total and existing payments
          $purchaseOrder->balance_due = max(0, $validated['total_amount'] - $amountPaid);
          
          // Update payment status based on balance due and amount paid
          if ($purchaseOrder->balance_due <= 0) {
              $purchaseOrder->payment_status = 'paid';
          } elseif ($amountPaid > 0) {
              $purchaseOrder->payment_status = 'partially_paid';
          } else {
              $purchaseOrder->payment_status = 'unpaid';
          }
          
          // Save the purchase order
          $purchaseOrder->save();
          
          // Delete existing purchase order items
          $purchaseOrder->items()->delete();
          
          // Create new purchase order items
          foreach ($validated['items'] as $item) {
              // Create the new item
              $orderItem = new PurchaseOrderItem([
                  'purchase_order_id' => $purchaseOrder->id,
                  'inventory_id' => $item['inventory_id'],
                  'quantity' => $item['quantity'],
                  'unit' => $item['unit'],
                  'unit_price' => $item['unit_price'],
                  'tax_rate' => $item['tax_rate'],
                  'tax_amount' => $item['tax_amount'],
                  'discount_rate' => $item['discount_rate'],
                  'discount_amount' => $item['discount_amount'],
                  'subtotal' => $item['subtotal'],
                  'total' => $item['total'],
              ]);
              
              $orderItem->save();
          }
          
          // Commit the transaction
          DB::commit();
          
          return redirect()->route('purchase-orders.show', $purchaseOrder->id)
              ->with('success', 'Purchase order updated successfully.');
              
      } catch (Exception $e) {
          // Roll back the transaction on error
          DB::rollBack();
          
          return redirect()->back()
              ->withInput()
              ->with('error', 'Failed to update purchase order: ' . $e->getMessage());
      }
  }

    /**
     * Remove the specified purchase order from storage.
     */
    public function destroy($id)
    {
        try {
            // Start a database transaction
            DB::beginTransaction();

            $purchaseOrder = PurchaseOrder::findOrFail($id);

            // Delete related items first
            $purchaseOrder->items()->delete();

            // Delete the purchase order
            $purchaseOrder->delete();

            // Commit the transaction
            DB::commit();

            return redirect()->route('purchase-orders.index')
                ->with('success', 'Purchase order deleted successfully.');
        } catch (\Exception $e) {
            // Roll back the transaction in case of an error
            DB::rollBack();

            return redirect()->back()
                ->with('error', 'Failed to delete purchase order: ' . $e->getMessage());
        }
    }

    /**
     * Generate a unique PO number.
     */
    public function generatePoNumber()
    {
        $prefix = 'PO-';
        $date = now()->format('Ymd');
        $lastPo = PurchaseOrder::where('po_number', 'like', $prefix . $date . '%')
            ->orderBy('po_number', 'desc')
            ->first();

        if ($lastPo) {
            $lastNumber = intval(substr($lastPo->po_number, -4));
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $date . '-' . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Mark a purchase order as paid.
     */
    public function markAsPaid($id)
    {
        try {
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            $purchaseOrder->update([
                'payment_status' => 'paid',
                'amount_paid' => $purchaseOrder->total_amount,
                'balance_due' => 0
            ]);

            return redirect()->back()
                ->with('success', 'Purchase order marked as paid successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update payment status: ' . $e->getMessage());
        }
    }

    /**
     * Record a partial payment for a purchase order.
     */
    public function recordPayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'payment_amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'payment_reference' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            $purchaseOrder = PurchaseOrder::findOrFail($id);
            
            // Calculate new amount paid and balance due
            $newAmountPaid = $purchaseOrder->amount_paid + $request->payment_amount;
            $newBalanceDue = $purchaseOrder->total_amount - $newAmountPaid;
            
            // Determine payment status
            $paymentStatus = 'partially_paid';
            if ($newBalanceDue <= 0) {
                $paymentStatus = 'paid';
                $newBalanceDue = 0;
            } elseif ($newAmountPaid <= 0) {
                $paymentStatus = 'unpaid';
            }
            
            // Update purchase order
            $purchaseOrder->update([
                'payment_status' => $paymentStatus,
                'amount_paid' => $newAmountPaid,
                'balance_due' => $newBalanceDue
            ]);
            
            // Create payment record (assuming you have a Payment model)
            // Payment::create([
            //     'purchase_order_id' => $purchaseOrder->id,
            //     'amount' => $request->payment_amount,
            //     'payment_date' => $request->payment_date,
            //     'payment_method' => $request->payment_method,
            //     'reference' => $request->payment_reference,
            //     'user_id' => auth()->id(),
            // ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Payment recorded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to record payment: ' . $e->getMessage());
        }
    }

    /**
     * Print or download purchase order as PDF.
     */
    public function generatePdf($id)
    {
        $purchaseOrder = PurchaseOrder::with([
            'customer:id,first_name,last_name,company_name,email,phone,location',
            'user:id,name,email',
            'items.inventory:id,name,packaging_type'
        ])->findOrFail($id);

        // Assuming you have a PDF generation library like DomPDF
        // $pdf = PDF::loadView('pdfs.purchase-order', compact('purchaseOrder'));
        
        // return $pdf->download('purchase-order-' . $purchaseOrder->po_number . '.pdf');
        
        // For now, just return a view
        return view('pdfs.purchase-order', compact('purchaseOrder'));
    }
}

