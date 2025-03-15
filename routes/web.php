<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\PaymentController;
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

    // Purchase Order routes
    Route::prefix('purchase-orders')->group(function () {
        Route::get('/', [PurchaseOrderController::class, 'index'])->name('purchase-orders.index');
        Route::get('/create', [PurchaseOrderController::class, 'create'])->name('purchase-orders.create');
        Route::post('/store', [PurchaseOrderController::class, 'store'])->name('purchase-orders.store');
        Route::get('/{purchaseOrder}/show', [PurchaseOrderController::class, 'show'])->name('purchase-orders.show');
        Route::get('/{purchaseOrder}/edit', [PurchaseOrderController::class, 'edit'])->name('purchase-orders.edit');
        Route::put('/{purchaseOrder}/update', [PurchaseOrderController::class, 'update'])->name('purchase-orders.update');
        Route::delete('/{purchaseOrder}/delete', [PurchaseOrderController::class, 'destroy'])->name('purchase-orders.destroy');
    });

    // Payment routes
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('/store', [PaymentController::class, 'store'])->name('payments.store');
        Route::get('/{payment}/show', [PaymentController::class, 'show'])->name('payments.show');
        Route::get('/{payment}/edit', [PaymentController::class, 'edit'])->name('payments.edit');
        Route::put('/{payment}/update', [PaymentController::class, 'update'])->name('payments.update');
        Route::delete('/{payment}/delete', [PaymentController::class, 'destroy'])->name('payments.destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

