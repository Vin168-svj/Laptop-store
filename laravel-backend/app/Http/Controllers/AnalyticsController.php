<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AnalyticsController extends Controller
{
    /**
     * GET /api/analytics
     * Admin restricted dashboard summary compiler
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden'
            ], 403);
        }

        // 1. Total sales configuration excluding Cancelled
        $totalSales = Order::where('status', '!=', 'Cancelled')->sum('total');

        // 2. Absolute quantities counts
        $totalOrders = Order::count();
        $totalCustomers = User::where('is_admin', false)->count();
        $totalProductsCount = (int)Product::sum('stock');

        // 3. Category Sales compiling
        $categorySales = [
            'Premium' => 0.0,
            'Gaming' => 0.0,
            'Business' => 0.0,
            'Student' => 0.0
        ];

        // Hydrate category map
        $activeOrders = Order::with('items')->where('status', '!=', 'Cancelled')->get();
        foreach ($activeOrders as $order) {
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product && isset($categorySales[$product->category])) {
                    $categorySales[$product->category] += ($item->price * $item->quantity);
                }
            }
        }

        // 4. Retrieve most recent 5 transactions
        $recentSales = Order::with('items')->orderBy('created_at', 'desc')->take(5)->get();

        return response()->json([
            'metrics' => [
                'totalSales' => (double)$totalSales,
                'totalOrders' => (int)$totalOrders,
                'totalCustomers' => (int)$totalCustomers,
                'totalProductsCount' => (int)$totalProductsCount
            ],
            'categorySales' => $categorySales,
            'recentSales' => $recentSales
        ]);
    }
}
