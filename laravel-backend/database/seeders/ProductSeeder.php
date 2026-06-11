<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'id' => 'p1',
                'name' => 'ZenBook Pro Duo 15',
                'brand' => 'ASUS',
                'price' => 2499.00,
                'description' => 'The ultimate professional dual-screen workstation laptop. Designed for programmers, designers, and video editors who need screen real-estate. Equipped with full width UHD ASUS ScreenPad Plus secondary touchscreen that tilts automatically for optimal viewing comfort.',
                'images' => [
                    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Intel Core i9-13900H (14-Core, up to 5.4GHz)',
                    'ram' => '32GB LPDDR5 Dual Channel',
                    'storage' => '2TB PCIe Gen4 NVMe M.2 SSD',
                    'graphics' => 'NVIDIA GeForce RTX 4070 (8GB GDDR6)',
                    'display' => '15.6" 4K (3840 x 2160) OLED HDR Touchscreen 120Hz',
                    'battery' => '92WHr (Up to 7 hours)'
                ],
                'category' => 'Premium',
                'stock' => 12,
                'rating' => 4.8,
                'is_best_seller' => true,
                'is_new_arrival' => false
            ],
            [
                'id' => 'p2',
                'name' => 'Blade 16 Extreme',
                'brand' => 'Razer',
                'price' => 3299.00,
                'description' => 'Elite, thin, high-performance gaming rig wrapped in CNC aluminum. Features dual-mode mini-LED display allowing instant toggle between ultra-high 4K resolution at 120Hz for designers and fast Full HD at 240Hz for competitive gaming.',
                'images' => [
                    'https://images.unsplash.com/photo-1603302576837-37561b2fe536?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Intel Core i9-14900HX (24-Core, up to 5.8GHz)',
                    'ram' => '32GB DDR5 5600MHz (Upgradable)',
                    'storage' => '2TB PCIe 4.0 NVMe SSD',
                    'graphics' => 'NVIDIA GeForce RTX 4080 (12GB GDDR6)',
                    'display' => '16" QHD+ Mini-LED 240Hz Dual-Mode panel',
                    'battery' => '95WHr (Up to 5 hours)'
                ],
                'category' => 'Gaming',
                'stock' => 8,
                'rating' => 4.6,
                'is_best_seller' => false,
                'is_new_arrival' => true
            ],
            [
                'id' => 'p3',
                'name' => 'MacBook Pro 16" M3 Max',
                'brand' => 'Apple',
                'price' => 3499.00,
                'description' => 'The supreme workstation engineered for demanding workflows. Absolute performance without throttling, whether connected or running on battery. Phenomenal dynamic range Liquid Retina XDR screen with supreme acoustics and gorgeous space black anodized finish.',
                'images' => [
                    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Apple M3 Max (16-Core CPU, 40-Core GPU)',
                    'ram' => '48GB Unified Memory',
                    'storage' => '1TB Superfast SSD (Up to 7.4GB/s)',
                    'graphics' => 'Apple 40-Core Custom GPU (Hardware-accelerated ray tracing)',
                    'display' => '16.2" Liquid Retina XDR display (3456 x 2234, 120Hz ProMotion)',
                    'battery' => '100WHr (Up to 22 hours)'
                ],
                'category' => 'Premium',
                'stock' => 15,
                'rating' => 4.9,
                'is_best_seller' => true,
                'is_new_arrival' => true
            ],
            [
                'id' => 'p4',
                'name' => 'ThinkPad X1 Carbon Gen 11',
                'brand' => 'Lenovo',
                'price' => 1899.00,
                'description' => 'The legendary pinnacle of business laptops. Built to military standards with incredibly lightweight carbon-fiber chassis. Iconic tactile keyboard, dual discrete Thunderbolt 4 ports, advanced biometric privacy guard, and superior thermal dissipation.',
                'images' => [
                    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1504707142491-49788d038d1e?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Intel Core i7-1365U vPro (10-Core, up to 5.2GHz)',
                    'ram' => '16GB LPDDR5 6400MHz',
                    'storage' => '1TB PCIe Gen4 NVMe SSD Class 40',
                    'graphics' => 'Intel Iris Xe Graphics (Integrated)',
                    'display' => '14" WUXGA (1920 x 1200) IPS Anti-glare Touchscreen',
                    'battery' => '57WHr (Up to 14 hours)'
                ],
                'category' => 'Business',
                'stock' => 20,
                'rating' => 4.7,
                'is_best_seller' => true,
                'is_new_arrival' => false
            ],
            [
                'id' => 'p5',
                'name' => 'XPS 15 InfinityEdge',
                'brand' => 'Dell',
                'price' => 1999.00,
                'description' => 'Stunning bezels with fully immersive 16:10 InfinityEdge screen. Premium carbon-fiber palm rest and CNC aeronautical-grade platinum gray shell. Exceptional balanced platform for power-users, programmers, and students alike.',
                'images' => [
                    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Intel Core i7-13700H (14-Core, up to 5.0GHz)',
                    'ram' => '32GB DDR5 Dual Channel',
                    'storage' => '1TB PCIe NVMe SSD',
                    'graphics' => 'NVIDIA GeForce RTX 4050 (6GB GDDR6)',
                    'display' => '15.6" 3.5K OLED InfinityEdge Gold-Certified Touchscreen',
                    'battery' => '86WHr (Up to 9 hours)'
                ],
                'category' => 'Premium',
                'stock' => 10,
                'rating' => 4.5,
                'is_best_seller' => false,
                'is_new_arrival' => false
            ],
            [
                'id' => 'p6',
                'name' => 'Swift Go Pro 14',
                'brand' => 'Acer',
                'price' => 899.00,
                'description' => 'Unbelievable slim value offering high-speed performance. Incorporates a gorgeous high-density OLED monitor and modern lightweight composition. Equipped with state-of-the-art thermal technology to maintain operations silent for study sessions.',
                'images' => [
                    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'AMD Ryzen 7 7840U (8-Core, up to 5.1GHz)',
                    'ram' => '16GB LPDDR5 (Onboard)',
                    'storage' => '512GB PCIe Gen4 NVMe SSD',
                    'graphics' => 'AMD Radeon 780M (Modern discrete-class Integrated)',
                    'display' => '14" 2.8K (2880 x 1800) OLED 120Hz IPS display',
                    'battery' => '65WHr (Up to 11 hours)'
                ],
                'category' => 'Student',
                'stock' => 25,
                'rating' => 4.6,
                'is_best_seller' => true,
                'is_new_arrival' => false
            ],
            [
                'id' => 'p7',
                'name' => 'Victus 16 Edition',
                'brand' => 'HP',
                'price' => 1199.00,
                'description' => 'Accessible gaming laptop delivering superb processing velocity and rich colors. Dual fan ventilation keeps the system running cool under heavy multi-tasking and gameplay loads. Excellent starter rig for gaming students.',
                'images' => [
                    'https://images.unsplash.com/photo-1603302576837-37561b2fe536?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'Intel Core i5-13500HX (14-Core, up to 4.7GHz)',
                    'ram' => '16GB DDR5 Dual Channel',
                    'storage' => '1TB PCIe SSD',
                    'graphics' => 'NVIDIA GeForce RTX 4060 (8GB GDDR6)',
                    'display' => '16.1" FHD (1920 x 1080) 144Hz IPS display',
                    'battery' => '70WHr (Up to 6 hours)'
                ],
                'category' => 'Gaming',
                'stock' => 14,
                'rating' => 4.4,
                'is_best_seller' => false,
                'is_new_arrival' => true
            ],
            [
                'id' => 'p8',
                'name' => 'Pavilion Aero Ultra',
                'brand' => 'HP',
                'price' => 749.00,
                'description' => 'Incredibly lightweight magnesium-aluminum body weighing less than 1 kilogram. Remarkable screen clarity and battery efficiency for students. Ideal travel and classroom partner that fits easily in any standard backpack.',
                'images' => [
                    'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80'
                ],
                'specs' => [
                    'processor' => 'AMD Ryzen 5 7535U (6-Core, up to 4.5GHz)',
                    'ram' => '16GB DDR5 5200MHz',
                    'storage' => '512GB NVMe SSD Fast Class',
                    'graphics' => 'AMD Radeon Graphics (Integrated)',
                    'display' => '13.3" WUXGA (1920 x 1200) IPS 100% sRGB screen',
                    'battery' => '43WHr (Up to 10 hours)'
                ],
                'category' => 'Student',
                'stock' => 30,
                'rating' => 4.5,
                'is_best_seller' => false,
                'is_new_arrival' => false
            ]
        ];

        foreach ($products as $prod) {
            Product::updateOrCreate(['id' => $prod['id']], $prod);
        }
    }
}
