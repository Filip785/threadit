<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CommentsUpvotes;
use App\Models\PostsUpvotes;
use App\Models\Post;
use App\Models\Comment;

class PostController extends Controller
{
    public function index(Request $request) {
        $page = $request->page - 1;

        $posts = Post::with('user')->orderBy('id', 'desc')->skip($page * 20)->take(20)->get();

        $user = auth()->user();

        if($user) {
            foreach($posts as $post) {
                $post['did_upvote'] = $post->didUpvote($user->id, $post['id']);
            }
        }

        return $posts;
    }

    public function store(Request $request) {
        $this->validate($request, [
            'post_title' => 'required',
            'description' => 'required',
        ], [
            'post_title.required' => 'Please enter post title.',
            'description.required' => 'Please enter description.',
        ]);

        $userId = $request->get('user_id');

        $post = Post::create([
            'post_title' => $request->get('post_title'),
            'description' => $request->get('description'),
            'user_id' => $userId
        ]);

        return response()->json(['success' => 'Post created!'], 200);
    }

    public function get(int $id) {
        $post = Post::find($id);

        if(!$post) {
            return response()->json(['error' => 'Not Found!'], 404);
        }
        
        $comments = Comment::with(['user:id,username'])->where(['post_id' => $post->id])->get();

        $comments = $this->comments_replies_transform($comments);

        return [
            'post' => $post,
            'comments' => $comments
        ];
    }

    public function delete($id) {
        $post = Post::find($id);
        $user = auth()->user();

        if(!$user->is_admin && !($post->user_id === $user->id)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $post->delete();

            PostsUpvotes::where([
                'post_id' => $id
            ])->delete();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error while deleting post!'], 400);
        }

        return response()->json(['success' => 'Deleted!'], 200);
    }

    protected function comments_replies_transform($commentsArray) {
        foreach($commentsArray as &$item) {
            if(!is_array($item['replies'])) {
                $item['replies'] = json_decode($item['replies'], true);
            }

            $replyCount = count($item['replies']);

            if(isset($item['pattern'])) {
                $item['voteCount'] = $this->getVoteCount($item['pattern']);
            } else {
                $item['voteCount'] = $this->getVoteCount((string) $item->id);
            }

            if($replyCount > 0) {
                $item['replies'] = $this->comments_replies_transform($item['replies']);
            }
        }

        return $commentsArray;
    }

    protected function getVoteCount($pattern) {
        return CommentsUpvotes::where(['pattern' => $pattern])->count();
    }
}
