<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker;

use App\Models\User;
use App\Models\Post;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker\Factory::create();

        User::create([
            'username' => 'sudox785',
            'email' => 'fdjuricic98@gmail.com',
            'password' => Hash::make('ub2015!!'),
            'is_admin' => 1
        ]);

        User::create([
            'username' => 'filip785',
            'email' => 'fdjuricic98@outlook.com',
            'password' => Hash::make('ub2015!!'),
            'is_admin' => 0
        ]);

        for($i = 0; $i < 50; $i++) {
            Post::create([
                'post_title' => $faker->sentence(5),
                'description' => $faker->url(),
                'user_id' => rand(1, 2)
            ]);
        }
    }
}
