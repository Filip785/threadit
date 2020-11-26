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
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $adminId = DB::table('roles')->insertGetId([
            'name' => 'Administrator',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('roles')->insert([
            'name' => 'Subthreadit Admin',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('roles')->insert([
            'name' => 'Moderator',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('roles')->insert([
            'name' => 'Regular User',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('role_user')->insert([
            'role_id' => $adminId,
            'user_id' => $userId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
