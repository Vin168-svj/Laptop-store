<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'id' => 'u1',
                'email' => 'admin@techlaptop.com',
                'name' => 'John Admin',
                'password' => Hash::make('admin123'),
                'is_admin' => true,
                'phone' => '+1 (555) 019-2831',
                'address' => '100 Silicon Blvd, San Jose, CA',
                'joined_date' => '2026-01-10'
            ],
            [
                'id' => 'u2',
                'email' => 'customer@test.com',
                'name' => 'Alex Johnson',
                'password' => Hash::make('user123'),
                'is_admin' => false,
                'phone' => '+1 (555) 012-3456',
                'address' => '456 Pine Ave, Chicago, IL',
                'joined_date' => '2026-03-15'
            ],
            [
                'id' => 'u3',
                'email' => 'emily@test.com',
                'name' => 'Emily Watson',
                'password' => Hash::make('user123'),
                'is_admin' => false,
                'phone' => '+1 (555) 044-8899',
                'address' => '789 Oak Way, Seattle, WA',
                'joined_date' => '2026-04-12'
            ]
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['id' => $user['id']], $user);
        }
    }
}
