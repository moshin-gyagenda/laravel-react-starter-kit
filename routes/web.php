<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryController;
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
        Route::get('/{id}/show', [InventoryController::class, 'show'])->name('inventory.show');
        Route::get('/{id}/edit', [InventoryController::class, 'edit'])->name('inventory.edit');
        Route::put('/{id}/update', [InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/{id}/delete', [InventoryController::class, 'destroy'])->name('inventory.destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

