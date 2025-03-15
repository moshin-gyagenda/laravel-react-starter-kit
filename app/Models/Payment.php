<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'purchase_order_id',
        'customer_id',
        'user_id',
        'payment_number',
        'amount_paid',
        'payment_date',
        'payment_method',
        'reference_number',
        'status',
        'notes',
        'remaining_balance',
        'transaction_id',
        'payment_provider',
        'account_code',
        'tax_receipt_number',
    ];

    
    /**
     * Get the purchase order that this payment belongs to.
     */
    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    /**
     * Get the customer that this payment belongs to.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the user who recorded this payment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}