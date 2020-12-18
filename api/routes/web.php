<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('login', 'AuthController@login');
    $router->post('register', 'AuthController@register');

    $router->get('post/{id}', 'PostController@get');

    $router->group(
        ['middleware' => 'neutral'],
        function() use ($router) {
            $router->get('post/all', 'PostController@index');
        }
    );

    $router->group(
        ['middleware' => 'auth:api'], 
        function() use ($router) {
            $router->post('post/create', 'PostController@store');
            $router->delete('post/delete/{id}', 'PostController@delete');

            $router->post('comment/create', 'CommentController@store');

            $router->post('comment_upvote', 'CommentsUpvotesController@store');
            $router->delete('comment_remove_upvote', 'CommentsUpvotesController@delete');

            $router->post('post_upvote', 'PostsUpvotesController@store');
            $router->delete('post_remove_upvote', 'PostsUpvotesController@delete');
        }
    );
});