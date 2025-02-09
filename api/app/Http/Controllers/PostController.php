<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommentsUpvotes;
use App\Models\PostsUpvotes;
use App\Models\Post;
use App\Models\Comment;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->page - 1;

        $posts = Post::with('user')->orderBy('id', 'desc')->skip($page * 20)->take(20)->get();

        $user = auth()->user();

        if ($user) {
            foreach ($posts as $post) {
                $post['did_upvote'] = $post->didUpvote($user->id, $post['id']);
            }
        }

        return $posts;
    }

    public function store(Request $request)
    {
        $this->validate(
            $request,
            [
                'post_title' => 'required',
                'description' => 'required',
            ],
            [
                'post_title.required' => 'Please enter post title.',
                'description.required' => 'Please enter description.',
            ]
        );

        $user = auth()->user();

        $post = Post::create(
            [
            'post_title' => $request->get('post_title'),
            'description' => $request->get('description'),
            'user_id' => $user->id
            ]
        );

        return response()->json(['success' => 'Post created!'], 200);
    }

    public function get(int $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['error' => 'Not Found!'], 404);
        }

        $authUser = auth()->user();

        $comments = Comment::with(['user:id,username'])->where(['post_id' => $post->id])->get();

        $comments = Comment::commentRepliesTransform($comments, $authUser ? $authUser->id : null);

        return [
            'post' => $post,
            'comments' => $comments
        ];
    }

    public function delete($id)
    {
        $post = Post::find($id);
        $user = auth()->user();

        if (!$user->is_admin && !($post->user_id === $user->id)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            PostsUpvotes::where(
                [
                'post_id' => $id
                ]
            )->delete();

            CommentsUpvotes::where(
                [
                'post_id' => $id
                ]
            )->delete();

            Comment::where(
                [
                'post_id' => $id
                ]
            )->delete();

            $post->delete();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error while deleting post!'], 400);
        }

        return response()->json(['success' => 'Deleted!'], 200);
    }
}
