<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    
    protected $fillable = [
        'name',
        'description',
        'category',
        'quantity',
        'cost_price',
        'selling_price',
        'discount_price',
        'manufacturer',
    ];
}
