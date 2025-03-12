<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $inventories = Inventory::all();
        return Inertia::render('inventory/index', compact('inventories'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('inventory/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        

        // Begin a transaction
        DB::beginTransaction();

        try {
            // Create the inventory item
            $inventory = new Inventory();
            $inventory->name = $request->name;
            $inventory->description = $request->description;
            $inventory->category = $request->category === 'none' ? null : $request->category;
            $inventory->packaging_type = $request->packaging_type === 'none' ? null : $request->packaging_type;
            $inventory->quantity = $request->quantity;
            $inventory->cost_price = $request->cost_price;
            $inventory->selling_price = $request->selling_price;
            $inventory->discount_price = $request->discount_price;
            $inventory->manufacturer = $request->manufacturer;
            $inventory->status = $request->status;

            // Save the inventory item
            $inventory->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('inventory.index')->with('success', 'Inventory item created successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to create inventory item: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventory $inventory)
    {
        return Inertia::render('inventory/show', compact('inventory'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventory $inventory)
    {
        return Inertia::render('inventory/edit', compact('inventory'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inventory $inventory)
    {
       

        // Begin a transaction
        DB::beginTransaction();

        try {
            // Update the inventory item
            $inventory->name = $request->name;
            $inventory->description = $request->description;
            $inventory->category = $request->category === 'none' ? null : $request->category;
            $inventory->packaging_type = $request->packaging_type === 'none' ? null : $request->packaging_type;
            $inventory->quantity = $request->quantity;
            $inventory->cost_price = $request->cost_price;
            $inventory->selling_price = $request->selling_price;
            $inventory->discount_price = $request->discount_price;
            $inventory->manufacturer = $request->manufacturer;
            $inventory->status = $request->status;

            // Save the inventory item
            $inventory->save();

            // Commit the transaction
            DB::commit();

            return redirect()->route('inventory.index')->with('success', 'Inventory item updated successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to update inventory item: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory $inventory)
    {
        // Begin a transaction
        DB::beginTransaction();

        try {
            // Soft delete the inventory item
            $inventory->delete();

            // Commit the transaction
            DB::commit();

            return redirect()->route('inventory.index')->with('success', 'Inventory item deleted successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollback();

            return redirect()->back()->with('error', 'Failed to delete inventory item: ' . $e->getMessage());
        }
    }
}

