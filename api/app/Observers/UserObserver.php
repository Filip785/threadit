<?php

namespace App\Observers;

use App\Models\User;
use App\Models\CommentsUsers;

class UserObserver
{
    public function created(User $user)
    {
        CommentsUsers::create([ 'user_id' => $user->id, 'all_comments' => '[]' ]);
    }
}
