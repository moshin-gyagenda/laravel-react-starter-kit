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
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained('purchase_orders')->onDelete('cascade');
            $table->foreignId('inventory_id')->nullable()->constrained('inventories')->nullOnDelete();
        
            // Quantity information
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->nullable(); // e.g., pcs, kg, liters
            
            // Pricing information
            $table->decimal('unit_price', 10, 2);
            $table->decimal('tax_rate', 5, 2)->default(0); // Percentage
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount_rate', 5, 2)->default(0); // Percentage
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2); // unit_price * quantity
            $table->decimal('total', 10, 2); // subtotal + tax - discount
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
