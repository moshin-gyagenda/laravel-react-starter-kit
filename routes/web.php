<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CustomerController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
   
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

  // Inventory routes
    Route::prefix('inventory')->group(function () {
        Route::get('/', [InventoryController::class, 'index'])->name('inventory.index');
        Route::get('/create', [InventoryController::class, 'create'])->name('inventory.create');
        Route::post('/store', [InventoryController::class, 'store'])->name('inventory.store');
        Route::get('/{inventory}/show', [InventoryController::class, 'show'])->name('inventory.show');
        Route::get('/{inventory}/edit', [InventoryController::class, 'edit'])->name('inventory.edit');
        Route::put('/{inventory}/update', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/{inventory}/delete', [InventoryController::class, 'destroy'])->name('inventory.destroy');
    });

    // Customer routes
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('customers.create');
        Route::post('/store', [CustomerController::class, 'store'])->name('customers.store');
        Route::get('/{customer}/show', [CustomerController::class, 'show'])->name('customers.show');
        Route::get('/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
        Route::put('/{customer}/update', [CustomerController::class, 'update'])->name('customers.update');
        Route::delete('/{customer}/delete', [CustomerController::class, 'destroy'])->name('customers.destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

