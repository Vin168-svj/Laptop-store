<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please provide name, email, and password.'
            ], 400);
        }

        $existing = User::where('email', $request->email)->first();
        if ($existing) {
            return response()->json([
                'message' => 'User with this email already registered.'
            ], 400);
        }

        $newUser = User::create([
            'id' => 'u_' . round(microtime(true) * 1000),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => false,
            'joined_date' => date('Y-m-d')
        ]);

        $token = $newUser->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $newUser
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Please specify email and password.'
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Incorrect email or password combination.'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 200);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * PUT /api/auth/me
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $user->update($request->only(['name', 'phone', 'address']));

        return response()->json($user);
    }

    /**
     * GET /api/customers
     * Visible to Admin users ONLY
     */
    public function getCustomers(Request $request)
    {
        $currentUser = $request->user();
        if (!$currentUser->is_admin) {
            return response()->json([
                'message' => 'Admin permissions required'
            ], 403);
        }

        $customers = User::where('is_admin', false)->get();
        return response()->json($customers);
    }
}
