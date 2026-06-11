<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'price',
        'quantity',
        'image'
    ];

    protected $casts = [
        'price' => 'double',
        'quantity' => 'integer'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Map OrderItem properties for React client:
     * OrderItem: { productId, name, price, quantity, image }
     */
    public function toArray()
    {
        return [
            'productId' => (string)$this->product_id,
            'name' => $this->name,
            'price' => (double)$this->price,
            'quantity' => (int)$this->quantity,
            'image' => $this->image,
        ];
    }
}
