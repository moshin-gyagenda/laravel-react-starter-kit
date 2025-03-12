<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records to avoid duplicate entries
        DB::table('categories')->truncate();

        // Define categories
        $categories = [
            [
                'name' => 'Beverages',
                'description' => 'Drinks including water, soda, juice, coffee, and tea',
                'status' => 'active',
            ],
          
            [
                'name' => 'Dairy',
                'description' => 'Milk, cheese, yogurt, and other dairy products',
                'status' => 'active',
            ],
           
        ];

        // Insert categories
        foreach ($categories as $category) {
            Category::create($category);
        }

    }
}