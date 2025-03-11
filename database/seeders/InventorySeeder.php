<?php

namespace Database\Seeders;

use App\Models\Inventory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Product 1: Premium Coffee
        Inventory::create([
            'name' => 'Premium Arabica Coffee',
            'description' => 'High-quality Arabica coffee beans, medium roast with notes of chocolate and caramel. Perfect for espresso and filter brewing methods.',
            'category' => 'Beverages',
            'quantity' => 50,
            'cost_price' => 32000.00,
            'selling_price' => 55000.00,
            'discount_price' => null,
            'manufacturer' => 'Mountain Brew Co.',
        ]);

        // Product 2: Organic Green Tea
        Inventory::create([
            'name' => 'Organic Green Tea',
            'description' => 'Premium organic green tea leaves sourced from sustainable farms. Rich in antioxidants with a smooth, refreshing flavor profile.',
            'category' => 'Beverages',
            'quantity' => 75,
            'cost_price' => 23000.00,
            'selling_price' => 48000.00,
            'discount_price' => 40000.00,
            'manufacturer' => 'Harmony Teas',
        ]);

        // Product 3: Sparkling Mineral Water
        Inventory::create([
            'name' => 'Sparkling Mineral Water (24-pack)',
            'description' => 'Natural sparkling mineral water with a balanced mineral content. Zero calories, zero sweeteners, just pure refreshment in convenient 330ml cans.',
            'category' => 'Beverages',
            'quantity' => 30,
            'cost_price' => 45000.00,
            'selling_price' => 75000.00,
            'discount_price' => 65000.00,
            'manufacturer' => 'Alpine Springs',
        ]);

        // Product 4: Cold-Pressed Orange Juice
        Inventory::create([
            'name' => 'Cold-Pressed Orange Juice',
            'description' => 'Fresh cold-pressed orange juice made from 100% organic oranges. No added sugar, preservatives, or concentrates. Each bottle contains juice from approximately 8 oranges.',
            'category' => 'Beverages',
            'quantity' => 40,
            'cost_price' => 18000.00,
            'selling_price' => 33000.00,
            'discount_price' => null,
            'manufacturer' => 'Fresh Squeeze Inc.',
        ]);
    }
}

