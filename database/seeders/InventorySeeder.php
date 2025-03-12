<?php

namespace Database\Seeders;

use App\Models\Inventory;
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
            'packaging_type' => 'Single Unit',
            'status' => 'active',
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
            'packaging_type' => 'Carton (12 packs)',
            'status' => 'active',
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
            'packaging_type' => 'Case (24 cans)',
            'status' => 'active',
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
            'packaging_type' => 'Bottle (500ml)',
            'status' => 'active',
        ]);

        // Add a product with inactive status
        Inventory::create([
            'name' => 'Seasonal Berry Smoothie',
            'description' => 'Limited edition smoothie made with seasonal berries. Rich in vitamins and antioxidants. Perfect refreshment for hot days.',
            'category' => 'Beverages',
            'quantity' => 5,
            'cost_price' => 15000.00,
            'selling_price' => 28000.00,
            'discount_price' => null,
            'manufacturer' => 'Fruit Fusion Co.',
            'packaging_type' => 'Bottle (350ml)',
            'status' => 'inactive',
        ]);

        // Add a product with discontinued status
        Inventory::create([
            'name' => 'Classic Cola',
            'description' => 'Our original cola formula that has been replaced with a new improved recipe. This classic version is no longer in production.',
            'category' => 'Beverages',
            'quantity' => 10,
            'cost_price' => 8000.00,
            'selling_price' => 15000.00,
            'discount_price' => 12000.00,
            'manufacturer' => 'Refreshment Industries',
            'packaging_type' => 'Can (330ml)',
            'status' => 'discontinued',
        ]);
    }
}

