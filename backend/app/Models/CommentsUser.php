<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 * @mixin \Illuminate\Database\Query\Builder
 *
 * @property int user_id
 * @property array|string all_comments
 */
class CommentsUser extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'all_comments'
    ];
}
