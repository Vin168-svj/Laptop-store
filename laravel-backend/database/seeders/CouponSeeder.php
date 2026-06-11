<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'discount_type' => 'percentage',
                'discount_value' => 10.00,
                'min_subtotal' => 500.00,
                'is_active' => true,
                'description' => '10% OFF on purchases over $500'
            ],
            [
                'code' => 'SUPERLAP50',
                'discount_type' => 'fixed',
                'discount_value' => 50.00,
                'min_subtotal' => 800.00,
                'is_active' => true,
                'description' => '$50 flat discount for order size above $800'
            ],
            [
                'code' => 'GAMER200',
                'discount_type' => 'fixed',
                'discount_value' => 200.00,
                'min_subtotal' => 2000.00,
                'is_active' => true,
                'description' => 'Save $200 on premium pro rigs (Minimum spend $2000)'
            ]
        ];

        foreach ($coupons as $coupon) {
            Coupon::updateOrCreate(['code' => $coupon['code']], $coupon);
        }
    }
}
