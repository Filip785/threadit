<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $now = now();

        $userId = DB::table('users')->insertGetId([
            'username' => 'sudox785',
            'email' => 'fdjuricic98@gmail.com',
            'password' => Hash::make('ub2015!!'),
            'is_admin' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('comments_users')->insert([
            'user_id' => $userId,
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
