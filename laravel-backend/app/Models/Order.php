<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'customer_name',
        'customer_email',
        'subtotal',
        'discount',
        'total',
        'shipping_address',
        'payment_method',
        'status',
        'date',
        'tracking_number'
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'subtotal' => 'double',
        'discount' => 'double',
        'total' => 'double'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Parse Order properties for frontend consumption:
     * Order: { id, userId, customerName, customerEmail, items: OrderItem[], subtotal, discount, total, shippingAddress: { ... }, paymentMethod, status, date, trackingNumber? }
     */
    public function toArray()
    {
        return [
            'id' => (string)$this->id,
            'userId' => (string)$this->user_id,
            'customerName' => $this->customer_name,
            'customerEmail' => $this->customer_email,
            'items' => $this->relationLoaded('items') ? $this->items->toArray() : ($this->items()->get()->toArray()),
            'subtotal' => (double)$this->subtotal,
            'discount' => (double)$this->discount,
            'total' => (double)$this->total,
            'shippingAddress' => $this->shipping_address ?: [
                'street' => '',
                'city' => '',
                'state' => '',
                'zipCode' => '',
                'country' => ''
            ],
            'paymentMethod' => $this->payment_method,
            'status' => $this->status ?: 'Pending',
            'date' => $this->date ?: ($this->created_at ? $this->created_at->format('Y-m-d') : date('Y-m-d')),
            'trackingNumber' => $this->tracking_number ?: null,
        ];
    }
}
