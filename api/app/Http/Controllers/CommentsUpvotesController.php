<?php

namespace App\Http\Controllers;

use App\Models\CommentsUpvotes;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentsUpvotesController extends Controller {
    public function store(Request  $request) {
        $user = auth()->user();
        $pattern = $request->get('pattern');

        $argsArray = ['user_id' => $user->id, 'pattern' => $pattern];

        $upvote = CommentsUpvotes::where($argsArray)->first();

        if($upvote) {
            $upvote->delete();
            return response()->json(['success' => 'Removed existing upvote from comment!'], 200);
        }

        CommentsUpvotes::create([
            'user_id' => $user->id,
            'pattern' => $pattern
        ]);

        return response()->json(['success' => 'Upvoted!'], 200);
    }

    public function delete(Request $request) {
        CommentsUpvotes::where([
            'user_id' => $request->get('user_id'),
            'pattern' => $request->get('pattern')
        ])->delete();

        return response()->json(['success' => 'Deleted upvote!'], 200);
    }
}
