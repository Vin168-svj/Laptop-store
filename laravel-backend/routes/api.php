<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Public Coupon Routes
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);

// Authenticated Routes (Requires Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Profile Routes
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/me', [AuthController::class, 'updateProfile']);
    
    // Product Management (Admin or authenticated user review action)
    Route::post('/products/{id}/reviews', [ProductController::class, 'storeReview']);
    
    // Admin Only - Managing Products
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    
    // Customer Listing (Admin Only)
    Route::get('/customers', [AuthController::class, 'getCustomers']);
    
    // Orders Management
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    
    // Coupons Administration (Admin Only)
    Route::post('/coupons', [CouponController::class, 'store']);
    
    // Analytics Metrics (Admin Only)
    Route::get('/analytics', [AnalyticsController::class, 'index']);
});
