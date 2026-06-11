<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * GET /api/products
     */
    public function index()
    {
        $products = Product::with('reviews')->get();
        return response()->json($products);
    }

    /**
     * GET /api/products/{id}
     */
    public function show($id)
    {
        $product = Product::with('reviews')->find($id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found.'
            ], 404);
        }
        return response()->json($product);
    }

    /**
     * POST /api/products
     * Admin credentials check required.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden. Admin privileges required.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'price' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Missing required configuration fields'
            ], 400);
        }

        // Gather specs
        $inputSpecs = $request->input('specs', []);
        $specs = [
            'processor' => $inputSpecs['processor'] ?? 'Quad-Core Processor',
            'ram' => $inputSpecs['ram'] ?? '8GB RAM',
            'storage' => $inputSpecs['storage'] ?? '256GB SSD',
            'graphics' => $inputSpecs['graphics'] ?? 'Intel UHD Graphics',
            'display' => $inputSpecs['display'] ?? '15" Display',
            'battery' => $inputSpecs['battery'] ?? 'Up to 8 hours'
        ];

        $newProduct = Product::create([
            'id' => 'p_' . round(microtime(true) * 1000),
            'name' => $request->name,
            'brand' => $request->brand,
            'price' => (double)$request->price,
            'description' => $request->description ?? 'High-performance laptop.',
            'images' => $request->images ?: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80'],
            'specs' => $specs,
            'category' => $request->category ?? 'Student',
            'stock' => (int)($request->stock ?? 10),
            'rating' => 5.0,
            'is_best_seller' => (bool)($request->isBestSeller ?? $request->is_best_seller ?? false),
            'is_new_arrival' => (bool)($request->isNewArrival ?? $request->is_new_arrival ?? false)
        ]);

        // Express route uses custom status code 211, let's remain consistent if necessary, fallback 201
        return response()->json($newProduct, 201);
    }

    /**
     * PUT /api/products/{id}
     * Admin only.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden. Admin privileges required.'
            ], 403);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found.'
            ], 404);
        }

        // Support both camelCase and snake_case request fields
        $data = $request->all();
        if (isset($data['isBestSeller'])) {
            $data['is_best_seller'] = (bool)$data['isBestSeller'];
        }
        if (isset($data['isNewArrival'])) {
            $data['is_new_arrival'] = (bool)$data['isNewArrival'];
        }

        $product->update($data);

        // Load reviews of updated product to mirror Express response
        $product->load('reviews');

        return response()->json($product);
    }

    /**
     * DELETE /api/products/{id}
     * Admin only.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden. Admin privileges required.'
            ], 403);
        }

        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found.'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.'
        ]);
    }

    /**
     * POST /api/products/{id}/reviews
     * Authenticated state only.
     */
    public function storeReview(Request $request, $id)
    {
        $user = $request->user();
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please provide a valid rating between 1 and 5.'
            ], 400);
        }

        $newReview = Review::create([
            'id' => 'rev_' . round(microtime(true) * 1000),
            'product_id' => $product->id,
            'user_id' => $user->id,
            'user_name' => $user->name,
            'rating' => (int)$request->rating,
            'comment' => $request->comment ?? '',
            'date' => date('Y-m-d')
        ]);

        // Recalculate average rating of product
        $ratingsAverage = Review::where('product_id', $product->id)->avg('rating');
        $product->rating = round($ratingsAverage ?: 5.0, 1);
        $product->save();

        // Reload entire relation to output the updated product profile
        $product->load('reviews');

        return response()->json([
            'success' => true,
            'product' => $product
        ]);
    }
}
