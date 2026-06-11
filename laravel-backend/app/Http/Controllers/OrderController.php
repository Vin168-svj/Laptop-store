<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * GET /api/orders
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->is_admin) {
            // Admin sees all orders
            $orders = Order::with('items')->get();
        } else {
            // Customer sees their own orders
            $orders = Order::with('items')->where('user_id', $user->id)->get();
        }

        return response()->json($orders);
    }

    /**
     * POST /api/orders
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'shippingAddress' => 'required|array',
            'subtotal' => 'required|numeric',
            'total' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Missing purchase details.'
            ], 400);
        }

        // Use DB transaction to ensure atomic execution of stock check, decrement, and store operations
        return DB::transaction(function () use ($request, $user) {
            $items = $request->input('items', []);

            // 1. Stock check
            foreach ($items as $item) {
                $productId = $item['productId'] ?? null;
                $qty = $item['quantity'] ?? 1;

                if (!$productId) {
                    return response()->json([
                        'message' => 'Missing product ID in orders checkout.'
                    ], 400);
                }

                $product = Product::find($productId);
                if (!$product) {
                    return response()->json([
                        'message' => "System error. Product id {$productId} does not exist."
                    ], 400);
                }

                if ($product->stock < $qty) {
                    return response()->json([
                        'message' => "Insufficient stock for {$product->name}. Available: {$product->stock}"
                    ], 400);
                }
            }

            // 2. Decrement stock
            foreach ($items as $item) {
                $product = Product::find($item['productId']);
                $product->stock -= (int)$item['quantity'];
                $product->save();
            }

            // 3. Create Order
            $newOrder = Order::create([
                'id' => 'ord-' . rand(1000, 9999),
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'subtotal' => (double)$request->subtotal,
                'discount' => (double)($request->discount ?? 0),
                'total' => (double)$request->total,
                'shipping_address' => $request->shippingAddress,
                'payment_method' => $request->paymentMethod ?? 'Credit Card',
                'status' => 'Pending',
                'date' => date('Y-m-d')
            ]);

            // 4. Create Order Items
            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $newOrder->id,
                    'product_id' => $item['productId'],
                    'name' => $item['name'] ?? 'Premium Laptop Configuration',
                    'price' => (double)($item['price'] ?? 0),
                    'quantity' => (int)($item['quantity'] ?? 1),
                    'image' => $item['image'] ?? 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80'
                ]);
            }

            // Eager load items to return the complete structure
            $newOrder->load('items');

            return response()->json($newOrder, 201);
        });
    }

    /**
     * PUT /api/orders/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order records not found.'
            ], 404);
        }

        // Regular users checking on cancellation
        if (!$user->is_admin) {
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'message' => 'Forbidden. You do not own this order.'
                ], 403);
            }

            if ($request->status !== 'Cancelled') {
                return response()->json([
                    'message' => 'Regular users can only cancel orders.'
                ], 400);
            }

            if ($order->status !== 'Pending') {
                return response()->json([
                    'message' => 'Only active Pending orders can be cancelled.'
                ], 400);
            }
        }

        // Apply changes
        if ($request->has('status')) {
            $order->status = $request->status;
        }

        if ($request->has('trackingNumber')) {
            $order->tracking_number = $request->trackingNumber;
        }

        $order->save();

        return response()->json($order);
    }
}
