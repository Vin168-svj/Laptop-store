<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    /**
     * GET /api/coupons
     */
    public function index()
    {
        $coupons = Coupon::all();
        return response()->json($coupons);
    }

    /**
     * POST /api/coupons
     * Admin credentials check required.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->is_admin) {
            return response()->json([
                'message' => 'Forbidden. Admin credentials required.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50',
            'discountType' => 'required|string|in:percentage,fixed',
            'discountValue' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please provide code, type, and discount value.'
            ], 400);
        }

        $code = strtoupper(trim($request->code));
        
        // Prevent registering a duplicate code
        $exists = Coupon::find($code);
        if ($exists) {
            return response()->json([
                'message' => 'A coupon with this promo code already exists.'
            ], 400);
        }

        $newCoupon = Coupon::create([
            'code' => $code,
            'discount_type' => $request->discountType,
            'discount_value' => (double)$request->discountValue,
            'min_subtotal' => $request->minSubtotal ? (double)$request->minSubtotal : null,
            'is_active' => true,
            'description' => $request->description ?? "{$request->discountValue} discount coupon"
        ]);

        return response()->json($newCoupon, 201);
    }

    /**
     * POST /api/coupons/validate
     */
    public function validateCoupon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'subtotal' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Enter promo code and current subtotal.'
            ], 400);
        }

        $code = strtoupper(trim($request->code));
        $subtotal = (double)$request->subtotal;

        $coupon = Coupon::where('code', $code)->where('is_active', true)->first();

        if (!$coupon) {
            return response()->json([
                'message' => 'Invalid, deactivated, or expired coupon code.'
            ], 404);
        }

        if ($coupon->min_subtotal && $subtotal < $coupon->min_subtotal) {
            return response()->json([
                'message' => "Coupon is valid for orders over \${$coupon->min_subtotal}."
            ], 400);
        }

        return response()->json([
            'success' => true,
            'coupon' => $coupon
        ]);
    }
}
