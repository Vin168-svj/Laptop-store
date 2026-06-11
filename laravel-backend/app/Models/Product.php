<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'brand',
        'price',
        'description',
        'images',
        'specs',
        'category',
        'stock',
        'rating',
        'is_best_seller',
        'is_new_arrival'
    ];

    /**
     * Cast attributes to specific datatypes
     */
    protected $casts = [
        'images' => 'array',
        'specs' => 'array',
        'price' => 'double',
        'stock' => 'integer',
        'rating' => 'double',
        'is_best_seller' => 'boolean',
        'is_new_arrival' => 'boolean'
    ];

    /**
     * Relation with reviews
     */
    public function reviews()
    {
        return $this->hasMany(Review::class)->orderBy('created_at', 'desc');
    }

    /**
     * Match fields precisely with the original React client specification:
     * Product: { id, name, brand, price, description, images, specs: Specification, category, stock, rating, reviews: Review[], isBestSeller?, isNewArrival? }
     */
    public function toArray()
    {
        $array = [
            'id' => (string)$this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'price' => (double)$this->price,
            'description' => $this->description,
            'images' => $this->images ?: [],
            'specs' => $this->specs ?: [
                'processor' => 'Processor specifications offline',
                'ram' => '8GB Unified Memory',
                'storage' => '256GB SSD',
                'graphics' => 'Integrated Graphics',
                'display' => '15" Display Screen',
                'battery' => 'Up to 8 hours'
            ],
            'category' => $this->category,
            'stock' => (int)$this->stock,
            'rating' => (double)$this->rating,
            'reviews' => $this->relationLoaded('reviews') ? $this->reviews->toArray() : [],
        ];

        // Format snake_case keys used in dynamic checks to match camelCase expected by the React frontend
        if (isset($this->is_best_seller)) {
            $array['isBestSeller'] = (bool)$this->is_best_seller;
        }
        if (isset($this->is_new_arrival)) {
            $array['isNewArrival'] = (bool)$this->is_new_arrival;
        }

        return $array;
    }
}
