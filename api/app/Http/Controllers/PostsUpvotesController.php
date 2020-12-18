<?php

namespace App\Http\Controllers;

use App\Models\PostsUpvotes;
use Illuminate\Http\Request;

class PostsUpvotesController extends Controller {
    public function store(Request  $request) {
        $userId = $request->get('userId');
        $postId = $request->get('postId');

        $argsArray = ['user_id' => $userId, 'post_id' => $postId];

        $upvote = PostsUpvotes::where($argsArray)->first();

        if($upvote !== null) {
            $upvote->delete();
            return response()->json(['success' => 'Removed existing upvote from post!'], 200);
        }

        PostsUpvotes::create([
            'user_id' => $request->get('userId'),
            'post_id' => $request->get('postId')
        ]);

        // to do: dispaly change in votes on the frontend!

        return response()->json(['success' => 'Upvoted post!'], 200);
    }

    public function delete(Request $request) {
        PostsUpvotes::where([
            'user_id' => $request->get('userId'),
            'post_id' => $request->get('postId')
        ])->delete();

        return response()->json(['success' => 'Deleted post upvote!'], 200);
    }
}
