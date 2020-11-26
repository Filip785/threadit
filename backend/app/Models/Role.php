<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\RoleUser;

class Role extends Model
{
    use HasFactory;

    public function users() {
        return $this->belongsToMany(User::class)->withTimestamps()->using(RoleUser::class);
    }
}
