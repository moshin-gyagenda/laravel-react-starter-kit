<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Moshin Gyagenda',
            'email' => 'moshingyagenda7@gmail.com',
            'password' => Hash::make('moshin@2020'),
        ]);
    }
}
