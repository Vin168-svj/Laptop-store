<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = [
            [
                'id' => 'r1',
                'product_id' => 'p1', // ZenBook Pro Duo 15
                'user_id' => 'u2',     // Alex Johnson
                'user_name' => 'Alex Johnson',
                'rating' => 5,
                'comment' => 'Phenomenal laptop! The OLED screen is incredibly bright and colors are punchy. Highly recommend for developers and content creators.',
                'date' => '2026-05-15'
            ],
            [
                'id' => 'r2',
                'product_id' => 'p1', // ZenBook Pro Duo 15 (also added on Blade 16 in Express mock but referencing single product here is cleaner relational style)
                'user_id' => 'u3',    // Emily Watson
                'user_name' => 'Emily Watson',
                'rating' => 4,
                'comment' => 'Sleek design, runs extremely cool. Battery life is around 10-12 hours during mild office work. Graphics card handles modern titles with stable FPS.',
                'date' => '2026-05-18'
            ],
            [
                'id' => 'r3',
                'product_id' => 'p3', // MacBook Pro
                'user_id' => 'u3',    // Emily Watson
                'user_name' => 'Emily Watson',
                'rating' => 5,
                'comment' => 'Outstanding. The keyboard feels amazing, similar to the tactile keyboard. Workstation laptop. Perfect for compiling large projects.',
                'date' => '2026-05-20'
            ],
            [
                'id' => 'r4',
                'product_id' => 'p6', // Swift Go Pro 14
                'user_id' => 'u3',    // Emily Watson
                'user_name' => 'Emily Watson',
                'rating' => 5,
                'comment' => 'Absolutely stellar value. Best student companion. Incredible weight and keyboard layout for studying and programming on-the-go.',
                'date' => '2026-05-24'
            ]
        ];

        foreach ($reviews as $rev) {
            Review::updateOrCreate(['id' => $rev['id']], $rev);
        }
    }
}
