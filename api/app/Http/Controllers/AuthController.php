<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\CommentsUsers;

class AuthController extends Controller {
    public function __construct() {
        //$this->middleware('auth:api', ['except' => ['login', 'register']]);
        //$this->middleware('web');
    }

    public function login(Request $request)
    {
        //dd($credentials);

        $credentials = $this->validate($request, [
            'username' => 'required',
            'password' => 'required',
        ], [
            'username.required' => 'Please enter your username.',
            'password.required' => 'Please enter your password.',
        ]);

        $token = Auth::attempt($credentials);

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'id' => $user->id,
            'username' => $user->username,
            'is_admin' => $user->is_admin,
            'api_token' => $token
        ]);
    }

    public function register(Request $request) {
        $this->validate($request, [
            'username' => 'required|unique:users',
            'email' => 'required|unique:users|email',
            'password' => 'required|min:6'
        ], [
            'username.required' => 'Please enter your username.',
            'username.unique' => 'We already have that username. Please choose another one.',
            'email.required' => 'Please enter your email.',
            'email.unique' => 'We already have that email. Please choose another one.',
            'password.required' => 'Please enter your password.',
            'password.min' => 'Your password needs to be at least 6 characters in length.',
        ]);

        $user = User::create([
            'username' => $request->get('username'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);

        CommentsUsers::create([
            'user_id' => $user->id,
            'all_comments' => '[]',
        ]);

        return response()->json(['status' => 200]);
    }
}
