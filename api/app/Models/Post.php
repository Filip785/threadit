<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin Builder
 * @mixin \Illuminate\Database\Query\Builder
 *
 * @property int id
 * @property string post_title
 * @property string description
 * @property int user_id
 */
class Post extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'post_title',
        'description',
        'user_id'
    ];

    protected $appends = [
        'voteCount'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getVoteCountAttribute() {
        return PostsUpvotes::where(['post_id' => $this->id])->count();
    }
}
