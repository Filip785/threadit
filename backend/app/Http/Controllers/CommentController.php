<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    public function index() {
        //
    }

    public function store(Request $request) {
        $request->validate([
            'content' => 'required'
        ], [
            'content.required' => 'Please enter your comment.'
        ]);

        if($request->reply) {
            $ids = explode('|', $request->reply['longId']);
            $replyCount = count($ids);

            $commentParent = Comment::find($ids[0]);
            $commentParentReplies = json_decode($commentParent->replies, true);
            $commentParentRepliesCount = count($commentParentReplies);
            $now = now();

            // perhaps have another table that stores not normalized references to a specific user comments?

            if($replyCount === 1) {
                $commentParentReplies[$commentParentRepliesCount + 1] = $this->getInsertObject($request, $now);

                $commentParent->replies = json_encode($commentParentReplies);
                $commentParent->update();
            } else {
                unset($ids[0]);
                
                $refToUpdate = &$commentParentReplies;

                foreach($ids as $k => $id) {
                    $refToUpdate = &$refToUpdate[$id]['replies'];
                }

                $replyNextIndex = count($refToUpdate) + 1;

                $refToUpdate[$replyNextIndex] = $this->getInsertObject($request, $now);

                $commentParent->replies = json_encode($commentParentReplies);
                $commentParent->update();
            }
        } else {
            // comment is reply directly to the post (treated like a main comment or a parent comment)
            Comment::create([
                'content' => $request->content,
                'user_id' => $request->user_id,
                'post_id' => $request->post_id
            ]);
        }

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

    protected function getInsertObject($request, $now) {
        return [
            'content' => $request->content,
            'user_id' => $request->user_id,
            'post_id' => $request->post_id,
            'replies' => [],
            'created_at' => $now,
            'updated_at' => $now
        ];
    }
}
