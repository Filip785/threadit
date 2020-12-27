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
    public function store(Request $request)
    {
        $this->validate(
            $request,
            [
                'content' => 'required'
            ],
            [
                'content.required' => 'Please enter your comment.'
            ]
        );

        $postTreeId = null;
        $commentReturn = null;

        $reply = $request->input('reply');
        $commentParentReplies = null;

        $user = auth()->user();
        $userObject = ['id' => $user->id, 'username' => $user->username];

        if ($reply) {
            $postTreeId = $reply;

            $ids = explode('||', $postTreeId);

            $replyCount = count($ids);

            $commentParent = Comment::with(['user:id,username'])->find($ids[0]);
            $commentParentReplies = json_decode($commentParent->replies, true);
            $now = Carbon::now();

            if ($replyCount === 1) {
                $commentParentRepliesCount = count($commentParentReplies);
                $postTreeId = "$postTreeId||$commentParentRepliesCount";
                $commentParentReplies[$commentParentRepliesCount] = $this->getInsertObject(
                    $request,
                    $userObject,
                    $postTreeId,
                    $now
                );
            } else {
                unset($ids[0]);

                $commentParentReplies = $this->decodeRecurisveReplies(
                    $commentParentReplies
                );

                $refToUpdate = &$commentParentReplies;

                foreach ($ids as $id) {
                    $refToUpdate = &$refToUpdate[$id]['replies'];
                }

                $replyNextIndex = count($refToUpdate);

                $postTreeId = "$postTreeId||$replyNextIndex";
                $refToUpdate[$replyNextIndex] = $this->getInsertObject(
                    $request,
                    $userObject,
                    $postTreeId,
                    $now
                );
            }

            $commentParent->replies = json_encode($commentParentReplies);
            $commentParent->update();

            $commentReturn = $commentParent->toArray();
            $commentReturn['voteCount'] = Comment::getVoteCount(
                (string) $commentReturn['id']
            );
        } else {
            $comment = Comment::create(
                $this->getInsertObject($request, $userObject)
            );

            $postTreeId = strval($comment->id);

            $commentReturn = $comment->toArray();
            $commentReturn['user'] = $userObject;
            $commentReturn['replies'] = [];
            $commentReturn['voteCount'] = 1;
            $commentReturn['did_upvote'] = 1;
        }

        $commentsUserItem = CommentsUsers::select('id', 'all_comments')->where(
            [
                'user_id' => $user->id
            ]
        )->first();

        $postId = $request->get('post_id');

        $allCommentsDecoded = json_decode($commentsUserItem->all_comments, true);

        if (!isset($allCommentsDecoded[$postId])) {
            $allCommentsDecoded[$postId] = [];
        }

        $allCommentsDecoded[$postId][] = $postTreeId;
        $commentsUserItem->all_comments = json_encode($allCommentsDecoded);
        $commentsUserItem->update();

        //add initial upvote from the user that posted comment
        CommentsUpvotes::create(
            [
                'user_id' => $user->id,
                'post_id' => $postId,
                'pattern' => $postTreeId
            ]
        );

        if ($reply) {
            $commentReturn['replies'] = Comment::commentRepliesTransform(
                $commentParentReplies,
                $user->id
            );
        }

        Post::where('id', $postId)->update(
            [
                'comment_count' => DB::raw('comment_count+1')
            ]
        );

        return response()->json(['comment' => $commentReturn], 200);
    }

    protected function getInsertObject(Request $request, $user, $pattern = null, $now = null)
    {
        $insertObject = [
            'content' => $request->get('content'),
            'user_id' => $user['id'],
            'post_id' => $request->get('post_id'),
            'replies' => '[]'
        ];

        if ($now) {
            $insertObject['pattern'] = $pattern;
            $insertObject['user'] = $user;
            $insertObject['created_at'] = $now;
            $insertObject['updated_at'] = $now;
        }

        return $insertObject;
    }

    protected function decodeRecurisveReplies($commentParentReplies, bool $with_decode = false)
    {
        if ($with_decode) {
            $commentParentReplies = json_decode($commentParentReplies, true);
        }

        foreach ($commentParentReplies as &$parentReply) {
            if ($parentReply['replies']) {
                // if there are multiple replies dont decode immediately
                $dec = is_array($parentReply['replies']) ? false : true;

                $parentReply['replies'] = $this->decodeRecurisveReplies(
                    $parentReply['replies'],
                    $dec
                );
            }
        }

        return $commentParentReplies;
    }
}
