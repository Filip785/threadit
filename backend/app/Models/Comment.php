<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 * @mixin \Illuminate\Database\Query\Builder
 *
 * @property string content
 * @property array|string replies
 * @property int user_id
 * @property int post_id
 */
class Comment extends Model {
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'post_id'
    ];
}
