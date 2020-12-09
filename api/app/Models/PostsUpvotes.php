<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * @mixin Builder
 * @mixin \Illuminate\Database\Query\Builder
 *
 * @property int id
 * @property int user_id
 * @property int post_id
 */
class PostsUpvotes extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id'
    ];
}
