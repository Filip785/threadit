<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

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
            'all_comments' => '[]',
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
