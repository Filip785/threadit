<?php

namespace App\Observers;

use App\Models\Post;
use App\Models\PostsUpvotes;

class PostObserver
{
    public function created(Post $post)
    {
        PostsUpvotes::create(
            [
                'user_id' => $post->user_id,
                'post_id' => $post->id
            ]
        );
    }
}
