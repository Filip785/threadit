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
        'post_id',
        'replies'
    ];

    public static function comments_replies_transform($commentsArray, $userId = null) {
        foreach($commentsArray as &$item) {
            $item = self::comment_reply_transform($item, $userId);
        }

        return $commentsArray;
    }

    public static function comment_reply_transform($item, $userId = null) {
        if(!is_array($item['replies'])) {
            $item['replies'] = json_decode($item['replies'], true);
        }

        $replyCount = count($item['replies']);

        $patternKey = null;

        if(isset($item['pattern'])) {
            $patternKey = $item['pattern'];
        } else {
            $patternKey = (string) $item->id;
        }

        $item['voteCount'] = self::getVoteCount($patternKey);

        if($userId) {
            $didUpvote = CommentsUpvotes::where(['pattern' => $patternKey, 'user_id' => $userId])->first();
            $item['did_upvote'] = ($didUpvote === null) ? 0 : 1;
        }

        if($replyCount > 0) {
            $ref = $item['replies'];

            foreach($ref as &$reply) {
                $reply = self::comment_reply_transform($reply, $userId);
            }

            $item['replies'] = $ref;
        }

        return $item;
    }

    public static function getVoteCount($pattern) {
        return CommentsUpvotes::where(['pattern' => $pattern])->count();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
