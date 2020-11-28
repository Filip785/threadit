<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index() {
        return Post::all();
    }

    public function store(Request $request) {
        $request->validate([
            'post_title' => 'required',
            'description' => 'required',
        ], [
            'post_title.required' => 'Please enter post title.',
            'description.required' => 'Please enter description.',
        ]);

        Post::create([
            'post_title' => $request->get('post_title'),
            'description' => $request->get('description'),
            'user_id' => $request->get('user_id'),
            'upvotes' => 1,
        ]);

        return response()->json(['success' => 'Post created!'], 200);
    }

    public function get(int $id) {
        $post = Post::find($id);

        if(!$post) {
            return response()->json(['error' => 'Not Found!'], 404);
        }

        return $post;
    }

    public function delete($id) {
        $post = Post::find($id);
        $user = auth()->user();

        if(!$user->is_admin && !($post->user_id === $user->id)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $post->delete();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error while deleting post!'], 400);
        }

        return response()->json(['success' => 'Deleted!'], 200);
    }
}
