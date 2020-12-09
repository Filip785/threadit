<?php

namespace App\Http\Controllers;

use App\Models\CommentsUpvotes;
use Illuminate\Http\Request;

class CommentUpvotesController extends Controller {
    public function store(Request  $request) {
        CommentsUpvotes::create([
            'user_id' => $request->get('user_id'),
            'pattern' => $request->get('pattern')
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
