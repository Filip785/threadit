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
 * @property string pattern
 */
class CommentsUpvote extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pattern'
    ];
}
