<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Prevent increments since Express used string IDs like 'u1', 'u2'
     * However, if the user starts fresh, they might want string type or auto increments.
     * We will use a string primary key to easily support 'u1', 'u2', and 'u_' . timestamp ids.
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'is_admin',
        'phone',
        'address',
        'joined_date'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Relationship with Orders
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Relationship with Reviews
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Format Model serialization for React frontend compatibility.
     * Guaranteed to match the User.ts interface: { id, email, name, isAdmin, phone, address, joinedDate }
     */
    public function toArray()
    {
        return [
            'id' => (string)$this->id,
            'email' => $this->email,
            'name' => $this->name,
            'isAdmin' => (bool)$this->is_admin,
            'phone' => $this->phone,
            'address' => $this->address,
            'joinedDate' => $this->joined_date ?: ($this->created_at ? $this->created_at->format('Y-m-d') : null),
        ];
    }
}
