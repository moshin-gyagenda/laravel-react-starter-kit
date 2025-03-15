<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get purchase orders with unpaid or partially paid status
        $pendingOrders = PurchaseOrder::with('customer', 'user')
            ->whereIn('payment_status', ['unpaid', 'partially_paid'])
            ->where('balance_due', '>', 0)
            ->orderBy('order_date', 'desc')
            ->paginate(10);

        // Get recent payments
        $recentPayments = Payment::with(['purchaseOrder.customer'])
            ->orderBy('payment_date', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('payments/index', [
            'pendingOrders' => $pendingOrders,
            'recentPayments' => [
                'data' => $recentPayments
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, $purchaseOrderId = null)
    {
        // Get purchase orders with unpaid or partially paid status
        $purchaseOrders = PurchaseOrder::with('customer')
            ->whereIn('payment_status', ['unpaid', 'partially_paid'])
            ->where('balance_due', '>', 0)
            ->orderBy('order_date', 'desc')
            ->get();

        $selectedOrder = null;
        $paymentHistory = null;
        
        if ($purchaseOrderId) {
            $selectedOrder = PurchaseOrder::with('customer')
                ->where('id', $purchaseOrderId)
                ->first();
                
            // Get payment history for this purchase order
            $paymentHistory = Payment::where('purchase_order_id', $purchaseOrderId)
                ->orderBy('payment_date', 'desc')
                ->get();
        }

        return Inertia::render('payments/create', [
            'purchaseOrders' => $purchaseOrders,
            'selectedOrder' => $selectedOrder,
            'paymentHistory' => $paymentHistory
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
            'payment_provider' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Generate a unique payment number
            $paymentNumber = 'PAY-' . date('Ymd') . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT);

            // Create the payment
            $payment = Payment::create([
                'purchase_order_id' => $validated['purchase_order_id'],
                'payment_number' => $paymentNumber,
                'amount_paid' => $validated['amount_paid'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'] ?? null,
                'transaction_id' => $validated['transaction_id'] ?? null,
                'payment_provider' => $validated['payment_provider'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => 'completed',
            ]);

            // Update the purchase order payment status
            $purchaseOrder = PurchaseOrder::findOrFail($validated['purchase_order_id']);
            
            // Update amount_paid and balance_due
            $purchaseOrder->amount_paid += $validated['amount_paid'];
            $purchaseOrder->balance_due = max(0, $purchaseOrder->total_amount - $purchaseOrder->amount_paid);
            
            // Determine new payment status
            if ($purchaseOrder->balance_due <= 0) {
                $purchaseOrder->payment_status = 'paid';
            } else {
                $purchaseOrder->payment_status = 'partially_paid';
            }
            
            $purchaseOrder->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('payments.index')
                ->with('success', 'Payment recorded successfully.');
        } catch (\Exception $e) {
            // Roll back the transaction in case of an error
            DB::rollBack();
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to record payment: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load(['purchaseOrder.customer', 'purchaseOrder.user']);
        
        return Inertia::render('payments/show', [
            'payment' => $payment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $payment->load('purchaseOrder.customer');
        
        $purchaseOrders = PurchaseOrder::with('customer')
            ->whereIn('payment_status', ['unpaid', 'partially_paid', 'paid'])
            ->orderBy('order_date', 'desc')
            ->get();
        
        return Inertia::render('payments/edit', [
            'payment' => $payment,
            'purchaseOrders' => $purchaseOrders
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        // Validate the request
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'amount_paid' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string|max:255',
            'transaction_id' => 'nullable|string|max:255',
            'payment_provider' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:completed,voided,refunded',
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Store the old values for comparison
            $oldPurchaseOrderId = $payment->purchase_order_id;
            $oldAmount = $payment->amount_paid;
            $oldStatus = $payment->status;
            
            // Update the payment
            $payment->update([
                'purchase_order_id' => $validated['purchase_order_id'],
                'amount_paid' => $validated['amount_paid'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'] ?? null,
                'transaction_id' => $validated['transaction_id'] ?? null,
                'payment_provider' => $validated['payment_provider'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'status' => $validated['status'],
            ]);

            // Update the purchase order payment status for both old and new purchase orders if they're different
            $purchaseOrdersToUpdate = [];
            
            // Add the old purchase order if it's different from the new one
            if ($oldPurchaseOrderId != $validated['purchase_order_id']) {
                $oldPurchaseOrder = PurchaseOrder::findOrFail($oldPurchaseOrderId);
                
                // Subtract the old payment amount if it was completed
                if ($oldStatus === 'completed') {
                    $oldPurchaseOrder->amount_paid -= $oldAmount;
                    $oldPurchaseOrder->balance_due = max(0, $oldPurchaseOrder->total_amount - $oldPurchaseOrder->amount_paid);
                }
                
                $purchaseOrdersToUpdate[] = $oldPurchaseOrder;
            }
            
            // Add the new purchase order
            $newPurchaseOrder = PurchaseOrder::findOrFail($validated['purchase_order_id']);
            
            // If this is the same purchase order as before, adjust the amount
            if ($oldPurchaseOrderId == $validated['purchase_order_id']) {
                // If the old status was completed, subtract the old amount first
                if ($oldStatus === 'completed') {
                    $newPurchaseOrder->amount_paid -= $oldAmount;
                }
                
                // If the new status is completed, add the new amount
                if ($validated['status'] === 'completed') {
                    $newPurchaseOrder->amount_paid += $validated['amount_paid'];
                }
            } else {
                // This is a different purchase order, just add the new amount if status is completed
                if ($validated['status'] === 'completed') {
                    $newPurchaseOrder->amount_paid += $validated['amount_paid'];
                }
            }
            
            // Recalculate balance due
            $newPurchaseOrder->balance_due = max(0, $newPurchaseOrder->total_amount - $newPurchaseOrder->amount_paid);
            $purchaseOrdersToUpdate[] = $newPurchaseOrder;
            
            // Update payment status for all affected purchase orders
            foreach ($purchaseOrdersToUpdate as $po) {
                if ($po->balance_due <= 0) {
                    $po->payment_status = 'paid';
                } elseif ($po->amount_paid > 0) {
                    $po->payment_status = 'partially_paid';
                } else {
                    $po->payment_status = 'unpaid';
                }
                
                $po->save();
            }

            // Commit the transaction
            DB::commit();

            return redirect()->route('payments.index')
                ->with('success', 'Payment updated successfully.');
        } catch (\Exception $e) {
            // Roll back the transaction in case of an error
            DB::rollBack();
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update payment: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            // Store the purchase order ID and payment amount before deleting
            $purchaseOrderId = $payment->purchase_order_id;
            $paymentAmount = $payment->amount_paid;
            $paymentStatus = $payment->status;
            
            // Delete the payment
            $payment->delete();
            
            // Update the purchase order payment status
            $purchaseOrder = PurchaseOrder::findOrFail($purchaseOrderId);
            
            // Only adjust the amount if the payment was completed
            if ($paymentStatus === 'completed') {
                // Subtract the payment amount from the purchase order
                $purchaseOrder->amount_paid -= $paymentAmount;
                $purchaseOrder->balance_due = max(0, $purchaseOrder->total_amount - $purchaseOrder->amount_paid);
            }
            
            // Determine new payment status
            if ($purchaseOrder->balance_due <= 0) {
                $purchaseOrder->payment_status = 'paid';
            } elseif ($purchaseOrder->amount_paid > 0) {
                $purchaseOrder->payment_status = 'partially_paid';
            } else {
                $purchaseOrder->payment_status = 'unpaid';
            }
            
            $purchaseOrder->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('payments.index')
                ->with('success', 'Payment deleted successfully.');
        } catch (\Exception $e) {
            // Roll back the transaction in case of an error
            DB::rollBack();
            
            return redirect()->back()
                ->with('error', 'Failed to delete payment: ' . $e->getMessage());
        }
    }
}
