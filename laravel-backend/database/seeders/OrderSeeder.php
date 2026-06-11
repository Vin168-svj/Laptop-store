<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Order 1001
        $order1 = Order::updateOrCreate(
            ['id' => 'ord-1001'],
            [
                'user_id' => 'u2',
                'customer_name' => 'Alex Johnson',
                'customer_email' => 'customer@test.com',
                'subtotal' => 3499.00,
                'discount' => 0.00,
                'total' => 3499.00,
                'shipping_address' => [
                    'street' => '456 Pine Ave',
                    'city' => 'Chicago',
                    'state' => 'IL',
                    'zipCode' => '60601',
                    'country' => 'USA'
                ],
                'payment_method' => 'Credit Card',
                'status' => 'Shipped',
                'date' => '2026-05-20',
                'tracking_number' => 'LH-49281-US'
            ]
        );

        OrderItem::updateOrCreate(
            [
                'order_id' => $order1->id,
                'product_id' => 'p3'
            ],
            [
                'name' => 'MacBook Pro 16" M3 Max',
                'price' => 3499.00,
                'quantity' => 1,
                'image' => 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80'
            ]
        );

        // 2. Order 1002
        $order2 = Order::updateOrCreate(
            ['id' => 'ord-1002'],
            [
                'user_id' => 'u3',
                'customer_name' => 'Emily Watson',
                'customer_email' => 'emily@test.com',
                'subtotal' => 899.00,
                'discount' => 50.00,
                'total' => 849.00,
                'shipping_address' => [
                    'street' => '789 Oak Way',
                    'city' => 'Seattle',
                    'state' => 'WA',
                    'zipCode' => '98101',
                    'country' => 'USA'
                ],
                'payment_method' => 'PayPal',
                'status' => 'Processing',
                'date' => '2026-05-24'
            ]
        );

        OrderItem::updateOrCreate(
            [
                'order_id' => $order2->id,
                'product_id' => 'p6'
            ],
            [
                'name' => 'Swift Go Pro 14',
                'price' => 899.00,
                'quantity' => 1,
                'image' => 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=400&q=80'
            ]
        );
    }
}
