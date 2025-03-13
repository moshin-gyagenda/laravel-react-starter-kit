<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::with('user')->get();
        return Inertia::render('customers/index', compact('customers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('customers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        

        // Begin a transaction
        DB::beginTransaction();

        try {

            // Create the user
            $user = new User();
            $user->name = $request->first_name . ' ' . $request->last_name;
            $user->email = $request->email;
            $user->password = Hash::make("password");
            $user->save();

            // Create the customer
            $customer = new Customer();
            $customer->first_name = $request->first_name;
            $customer->last_name = $request->last_name;
            $customer->email = $request->email;
            $customer->phone = $request->phone;
            $customer->company_name = $request->company_name;
            $customer->location = $request->location;
            $customer->type = $request->type;
            $customer->status = $request->status;
            $customer->credit_limit = $request->credit_limit;
            $customer->outstanding_balance = $request->outstanding_balance ?? 0;
            $customer->user_id = $request->user_id === 'none' ? null : $request->user_id;

            // Save the customer
            $customer->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('customers.index')->with('success', 'Customer created successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to create customer: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        // Eager load the user relationship
        $customer->load('user');
        
        return Inertia::render('customers/show', compact('customer'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        // Eager load the user relationship
        $customer->load('user');
        
        // Get all users for the dropdown
        $users = User::orderBy('name')->get();
        
        return Inertia::render('customers/edit', [
            'customer' => $customer,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
       
        // Begin a transaction
        DB::beginTransaction();

        try {
            // Update the customer
            $customer->first_name = $request->first_name;
            $customer->last_name = $request->last_name;
            $customer->email = $request->email;
            $customer->phone = $request->phone;
            $customer->company_name = $request->company_name;
            $customer->location = $request->location;
            $customer->type = $request->type;
            $customer->status = $request->status;
            $customer->credit_limit = $request->credit_limit;
            $customer->outstanding_balance = $request->outstanding_balance ?? $customer->outstanding_balance;
            $customer->user_id = $request->user_id === 'none' ? null : $request->user_id;

            // Save the customer
            $customer->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to update customer: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        // Begin a transaction
        DB::beginTransaction();

        try {
            // Soft delete the customer
            $customer->delete();

            // Commit the transaction
            DB::commit();

            return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to delete customer: ' . $e->getMessage());
        }
    }
}