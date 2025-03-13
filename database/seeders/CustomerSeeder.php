<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Option 1: Create users for the customers
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => Hash::make('password'),
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane.smith@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create first customer (individual)
        Customer::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1 (555) 123-4567',
            'company_name' => "Yoya Technologies",
            'location' => 'New York, NY',
            'type' => 'individual',
            'status' => 'active',
            'credit_limit' => 0,
            'outstanding_balance' => 0.00,
            'user_id' => $user1->id,
        ]);

        // Create second customer (business)
        Customer::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+1 (555) 987-6543',
            'company_name' => 'Smith Enterprises',
            'location' => 'San Francisco, CA',
            'type' => 'business',
            'status' => 'active',
            'credit_limit' => 0,
            'outstanding_balance' =>0,
            'user_id' => $user2->id,
        ]);

        
    }
}