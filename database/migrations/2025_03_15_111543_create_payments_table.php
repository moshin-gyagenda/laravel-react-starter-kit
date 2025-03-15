<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('payment_number')->unique();
            $table->decimal('amount_paid', 15, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'check', 'credit_card', 'mobile_money', 'other']);
            $table->string('reference_number')->nullable()->comment('Check number, transaction ID, etc.');
            $table->enum('status', ['completed', 'pending', 'failed', 'refunded']);
            $table->text('notes')->nullable();
            // For partial payments tracking
            $table->decimal('remaining_balance', 15, 2)->default(0);
        
            // For mobile money or other electronic payments
            $table->string('transaction_id')->nullable();
            $table->string('payment_provider')->nullable()->comment('Bank name, mobile money provider, etc.');
            
            // For accounting purposes
            $table->string('account_code')->nullable();
            $table->string('tax_receipt_number')->nullable();
            
            $table->timestamps();
            $table->softDeletes(); // Allow for payment records to be "deleted" without losing the data
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
