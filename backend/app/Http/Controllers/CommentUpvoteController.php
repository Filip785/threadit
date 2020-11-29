<?php

namespace App\Http\Controllers;

use App\Models\CommentsUpvote;
use Illuminate\Http\Request;

class CommentUpvoteController extends Controller {
    public function store(Request  $request) {
        CommentsUpvote::create([
            'user_id' => $request->get('user_id'),
            'pattern' => $request->get('pattern')
        ]);

        return response()->json(['success' => 'Upvoted!'], 200);
    }

    public function delete(Request $request) {
        CommentsUpvote::where([
            'user_id' => $request->get('user_id'),
            'pattern' => $request->get('pattern')
        ])->delete();

        return response()->json(['success' => 'Deleted upvote!'], 200);
    }
}
