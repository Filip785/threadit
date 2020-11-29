<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentUpvoteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('refresh', [AuthController::class, 'refresh']);

Route::get('post', [PostController::class, 'index']);
Route::middleware('auth:api')->get('post/{id}', [PostController::class, 'get']);
Route::middleware('auth:api')->post('post/create', [PostController::class, 'store']);
Route::middleware('auth:api')->delete('post/delete/{id}', [PostController::class, 'delete']);

Route::middleware('auth:api')->post('comment/create', [CommentController::class, 'store']);

Route::middleware('auth:api')->post('comment_upvote', [CommentUpvoteController::class, 'store']);
Route::middleware('auth:api')->delete('comment_remove_upvote', [CommentUpvoteController::class, 'delete']);