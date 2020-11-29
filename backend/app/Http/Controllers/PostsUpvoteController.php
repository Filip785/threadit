<?php

namespace App\Http\Controllers;

use App\Models\PostsUpvote;
use Illuminate\Http\Request;

class PostsUpvoteController extends Controller {
    public function store(Request  $request) {
        PostsUpvote::create([
            'user_id' => $request->get('user_id'),
            'post_id' => $request->get('post_id')
        ]);

        return response()->json(['success' => 'Upvoted post!'], 200);
    }

    public function delete(Request $request) {
        PostsUpvote::where([
            'user_id' => $request->get('user_id'),
            'post_id' => $request->get('post_id')
        ])->delete();

        return response()->json(['success' => 'Deleted post upvote!'], 200);
    }
}
