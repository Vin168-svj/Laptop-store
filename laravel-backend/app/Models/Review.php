<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_id',
        'user_id',
        'user_name',
        'rating',
        'comment',
        'date'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Map Review attributes to the React frontend model standard:
     * Review: { id, userId, userName, rating, comment, date }
     */
    public function toArray()
    {
        return [
            'id' => (string)$this->id,
            'userId' => (string)$this->user_id,
            'userName' => $this->user_name ?: ($this->user ? $this->user->name : 'Anonymous Buyer'),
            'rating' => (int)$this->rating,
            'comment' => $this->comment,
            'date' => $this->date ?: ($this->created_at ? $this->created_at->format('Y-m-d') : date('Y-m-d')),
        ];
    }
}
