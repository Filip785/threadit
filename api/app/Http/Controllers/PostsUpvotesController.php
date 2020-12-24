<?php

namespace App\Http\Controllers;

use App\Models\PostsUpvotes;
use Illuminate\Http\Request;

class PostsUpvotesController extends Controller {
    public function store(Request  $request) {
        $user = auth()->user();
        $postId = $request->get('postId');

        $argsArray = ['user_id' => $user->id, 'post_id' => $postId];

        $upvote = PostsUpvotes::where($argsArray)->first();

        if($upvote !== null) {
            $upvote->delete();
            return response()->json(['success' => 'Removed existing upvote from post!'], 200);
        }

        PostsUpvotes::create([
            'user_id' => $user->id,
            'post_id' => $request->get('postId')
        ]);

        return response()->json(['success' => 'Upvoted post!'], 200);
    }
}
