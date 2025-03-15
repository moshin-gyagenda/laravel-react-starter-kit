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
        $selectedOrder = null;
        $paymentHistory = null;
        $purchaseOrders = [];
        
        if ($purchaseOrderId) {
            // Get the specific purchase order requested
            $selectedOrder = PurchaseOrder::with('customer')
                ->where('id', $purchaseOrderId)
                ->first();
                
            if (!$selectedOrder) {
                return redirect()->route('payments.index')
                    ->with('error', 'Purchase order not found.');
            }
            
            // Get payment history for this purchase order
            $paymentHistory = Payment::where('purchase_order_id', $purchaseOrderId)
                ->orderBy('payment_date', 'desc')
                ->get();
                
            // We only need this specific purchase order in the dropdown
            $purchaseOrders = [$selectedOrder];
        } else {
            // If no purchase order specified, get all orders with balances due
            $purchaseOrders = PurchaseOrder::with('customer')
                ->whereIn('payment_status', ['unpaid', 'partially_paid'])
                ->where('balance_due', '>', 0)
                ->orderBy('order_date', 'desc')
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
        // Begin a transaction
        DB::beginTransaction();

        try {
            // Get the purchase order to calculate remaining balance
            $purchaseOrder = PurchaseOrder::findOrFail($request->purchase_order_id);
            
            // Calculate the remaining balance after this payment
            $newAmountPaid = $purchaseOrder->amount_paid + $request->amount_paid;
            $newBalanceDue = max(0, $purchaseOrder->total_amount - $newAmountPaid);
            
            // Generate a unique payment number
            $paymentNumber = 'PAY-' . date('Ymd') . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT);

            // Create the payment
            $payment = new Payment();
            $payment->purchase_order_id = $request->purchase_order_id;
            $payment->customer_id = $request->customer_id;
            $payment->user_id = auth()->id(); // Current authenticated user
            $payment->payment_number = $paymentNumber;
            $payment->amount_paid = $request->amount_paid;
            $payment->payment_date = $request->payment_date;
            $payment->payment_method = $request->payment_method;
            $payment->reference_number = $request->reference_number;
            $payment->transaction_id = $request->transaction_id;
            $payment->payment_provider = $request->payment_provider;
            $payment->notes = $request->notes;
            $payment->status = $request->status ?? 'completed';
            $payment->remaining_balance = $newBalanceDue;
            $payment->account_code = $request->account_code;
            $payment->tax_receipt_number = $request->tax_receipt_number;
            $payment->save();

            // Update the purchase order payment status
            $purchaseOrder->amount_paid = $newAmountPaid;
            $purchaseOrder->balance_due = $newBalanceDue;
            
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
        // Start a database transaction
        DB::beginTransaction();

        try {
            // Store the old values for comparison
            $oldPurchaseOrderId = $payment->purchase_order_id;
            $oldAmount = $payment->amount_paid;
            $oldStatus = $payment->status;
            
            // Update the payment
            $payment->purchase_order_id = $request->purchase_order_id;
            $payment->amount_paid = $request->amount_paid;
            $payment->payment_date = $request->payment_date;
            $payment->payment_method = $request->payment_method;
            $payment->reference_number = $request->reference_number;
            $payment->transaction_id = $request->transaction_id;
            $payment->payment_provider = $request->payment_provider;
            $payment->notes = $request->notes;
            $payment->status = $request->status;
            $payment->save();

            // Update the purchase order payment status for both old and new purchase orders if they're different
            $purchaseOrdersToUpdate = [];
            
            // Add the old purchase order if it's different from the new one
            if ($oldPurchaseOrderId != $request->purchase_order_id) {
                $oldPurchaseOrder = PurchaseOrder::findOrFail($oldPurchaseOrderId);
                
                // Subtract the old payment amount if it was completed
                if ($oldStatus === 'completed') {
                    $oldPurchaseOrder->amount_paid -= $oldAmount;
                    $oldPurchaseOrder->balance_due = max(0, $oldPurchaseOrder->total_amount - $oldPurchaseOrder->amount_paid);
                }
                
                $purchaseOrdersToUpdate[] = $oldPurchaseOrder;
            }
            
            // Add the new purchase order
            $newPurchaseOrder = PurchaseOrder::findOrFail($request->purchase_order_id);
            
            // If this is the same purchase order as before, adjust the amount
            if ($oldPurchaseOrderId == $request->purchase_order_id) {
                // If the old status was completed, subtract the old amount first
                if ($oldStatus === 'completed') {
                    $newPurchaseOrder->amount_paid -= $oldAmount;
                }
                
                // If the new status is completed, add the new amount
                if ($request->status === 'completed') {
                    $newPurchaseOrder->amount_paid += $request->amount_paid;
                }
            } else {
                // This is a different purchase order, just add the new amount if status is completed
                if ($request->status === 'completed') {
                    $newPurchaseOrder->amount_paid += $request->amount_paid;
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

