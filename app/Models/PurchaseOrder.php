<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'po_number',
        'user_id',
        'customer_id',
        'order_date',
        'subtotal',
        'tax_amount',
        'shipping_cost',
        'discount_amount',
        'total_amount',
        'payment_terms',
        'payment_status',
        'amount_paid',
        'balance_due',
    ];


    /**
     * Get the user who created the purchase order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the customer associated with the purchase order.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the items for the purchase order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    /**
     * Calculate the total amount of the purchase order.
     */
    public function calculateTotal(): void
    {
        $this->subtotal = $this->items->sum('subtotal');
        $this->total_amount = $this->subtotal + $this->tax_amount + $this->shipping_cost - $this->discount_amount;
        $this->balance_due = $this->total_amount - $this->amount_paid;
        $this->save();
    }

    /**
     * Update payment status based on amount paid.
     */
    public function updatePaymentStatus(): void
    {
        if ($this->amount_paid <= 0) {
            $this->payment_status = 'unpaid';
        } elseif ($this->amount_paid < $this->total_amount) {
            $this->payment_status = 'partially_paid';
        } else {
            $this->payment_status = 'paid';
        }
        $this->save();
    }

    /**
     * Generate a unique PO number.
     */
    public static function generatePoNumber(): string
    {
        $prefix = 'PO-';
        $year = date('Y');
        $month = date('m');
        
        $latestOrder = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->latest()
            ->first();
            
        $nextNumber = $latestOrder ? intval(substr($latestOrder->po_number, -4)) + 1 : 1;
        
        return $prefix . $year . $month . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}