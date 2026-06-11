<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Coupon extends Model
{
    use HasFactory;

    // Use code as primary key since Express server used it directly
    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_subtotal',
        'is_active',
        'description'
    ];

    protected $casts = [
        'discount_value' => 'double',
        'min_subtotal' => 'double',
        'is_active' => 'boolean'
    ];

    /**
     * Map keys dynamically for frontend compatibility:
     * Coupon: { code, discountType, discountValue, minSubtotal?, isActive, description }
     */
    public function toArray()
    {
        return [
            'code' => $this->code,
            'discountType' => $this->discount_type,
            'discountValue' => (double)$this->discount_value,
            'minSubtotal' => $this->min_subtotal !== null ? (double)$this->min_subtotal : null,
            'isActive' => (bool)$this->is_active,
            'description' => $this->description,
        ];
    }
}
