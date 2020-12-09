<?php

namespace App\Http\Controllers;

use App\Models\PostsUpvotes;
use Illuminate\Http\Request;

class PostsUpvotesController extends Controller {
    public function store(Request  $request) {
        PostsUpvotes::create([
            'user_id' => $request->get('user_id'),
            'post_id' => $request->get('post_id')
        ]);

        return response()->json(['success' => 'Upvoted post!'], 200);
    }

    public function delete(Request $request) {
        PostsUpvotes::where([
            'user_id' => $request->get('user_id'),
            'post_id' => $request->get('post_id')
        ])->delete();

        return response()->json(['success' => 'Deleted post upvote!'], 200);
    }
}
