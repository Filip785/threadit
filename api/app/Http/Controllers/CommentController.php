<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\Comment;
use App\Models\CommentsUpvotes;
use App\Models\CommentsUsers;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function index() {
        //
    }

    public function store(Request $request) {
        $this->validate($request, [
            'content' => 'required'
        ], [
            'content.required' => 'Please enter your comment.'
        ]);

        $postTreeId = null;

        if($request->input('reply')) {
            $postTreeId = $request->input('reply');
            $ids = [];
            $user = auth()->user();
            $user = ['id' => $user->id, 'username' => $user->username];
            
            if(strpos($postTreeId, '||') !== false) {
                $ids = explode('||', $postTreeId);
            } else {
                $ids = explode('|', $postTreeId);
            }
            
            $replyCount = count($ids);

            $commentParent = Comment::find($ids[0]);
            $commentParentReplies = json_decode($commentParent->replies, true);
            $now = Carbon::now();

            // perhaps have another table that stores not normalized references to a specific user comments?

            if($replyCount === 1) {
                $commentParentRepliesCount = count($commentParentReplies);
                $postTreeId = "$postTreeId||$commentParentRepliesCount";
                $commentParentReplies[$addId] = $this->getInsertObject($request, $postTreeId, $now, $user);
            } else {
                unset($ids[0]);

                $commentParentReplies = $this->decode_recursive_replies($commentParentReplies);
                $refToUpdate = &$commentParentReplies;

                foreach($ids as $id) {
                    $refToUpdate = &$refToUpdate[$id]['replies'];  
                }

                $replyNextIndex = count($refToUpdate);
                $refToUpdate[$replyNextIndex] = $this->getInsertObject($request, $postTreeId, $now, $user);
            }

            $commentParent->replies = json_encode($commentParentReplies);
            $commentParent->update();
        } else {
            // comment is reply directly to the post (treated like a main comment or a parent comment)
            $comment = Comment::create($this->getInsertObject($request));

            $postTreeId = strval($comment->id);
        }

        $userId = $request->get('user_id');
        $commentsUserItem = CommentsUsers::select('id', 'all_comments')->where(['user_id' => $userId])->first();
        $postId = $request->get('post_id');

        $allCommentsDecoded = json_decode($commentsUserItem->all_comments, true);

        if(!isset($allCommentsDecoded[$postId])) {
            $allCommentsDecoded[$postId] = [];
        }

        $allCommentsDecoded[$postId][] = $postTreeId;
        $commentsUserItem->all_comments = json_encode($allCommentsDecoded);
        $commentsUserItem->update();

        //add initial upvote from the user that posted comment
        CommentsUpvotes::create([
            'user_id' => $userId,
            'pattern' => $postTreeId
        ]);

        Post::where('id', $postId)->update([
            'comment_count' => DB::raw('comment_count+1')
        ]);

        return response()->json(['success' => 'Comment created!'], 200);
    }

    public function get(Comment $comment) {
        //
    }

    public function update(Request $request, Comment $comment) {
        //
    }

    public function destroy(Comment $comment) {
        //
    }

    protected function getInsertObject(Request $request, $pattern = null, $now = null, $user = null) {
        $insertObject = [
            'content' => $request->get('content'),
            'user_id' => $request->get('user_id'),
            'post_id' => $request->get('post_id'),
            'replies' => '[]'
        ];

        if($now) {
            $insertObject['pattern'] = $pattern;
            $insertObject['user'] = $user;
            $insertObject['created_at'] = $now;
            $insertObject['updated_at'] = $now;
        }

        return $insertObject;
    }

    protected function decode_recursive_replies($commentParentReplies, bool $with_decode = false) {
        if($with_decode) {
            $commentParentReplies = json_decode($commentParentReplies, true);
        }

        foreach($commentParentReplies as &$parentReply) {
            if($parentReply['replies']) {
                // if there are multiple replies dont decode immediately
                $dec = is_array($parentReply['replies']) ? false : true;

                $parentReply['replies'] = $this->decode_recursive_replies($parentReply['replies'], $dec);
            }
        }

        return $commentParentReplies;
    }
}
