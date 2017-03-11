<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

//Group admin: all api of admin
Route::group(['as' => 'b_admin::', 'namespace' => 'Admin', 'prefix' => 'b_admin'], function () {

    //Group authentication: api for authentication like signin, signout, lockout
    Route::group(['as' => 'authentication::', 'namespace' => 'Auth', 'prefix' => 'auth'], function () {

        //Route to api to fetch system general information (use when first access to the system, without authentication)
        Route::post('signIn', ['as' => 'signIn', 'uses' => 'AdminAuthController@signIn']);

        //Route to api to log out from the system
        Route::post('signOut', ['as' => 'signOut', 'middleware' => 'auth',  'uses' => 'AdminAuthController@signOut']);
    });
});

//Group bds: all api using in the app itself
Route::group(['as' => 'bds::', 'namespace' => 'Bds', 'prefix' => 'bds'], function () {

    //Group stat: api to get site stat information
    Route::group(['as' => 'stat::', 'namespace' => 'Stat', 'prefix' => 'stat'], function () {

        //Route to api to fetch system general information (use when first access to the system, without authentication)
        Route::post('stat', ['as' => 'stat', 'uses' => 'StatController@siteStat']);
    });

    //Group investor: api to get information about investors
    Route::group(['as' => 'investor::', 'namespace' => 'Investor', 'prefix' => 'investor'], function () {

        //Route to api to fetch system general information (use when first access to the system, without authentication)
        Route::get('list', ['as' => 'list', 'uses' => 'InvestorController@investors']);
    });

    //Group project: api to get information about projects
    Route::group(['as' => 'project::', 'namespace' => 'Project', 'prefix' => 'project'], function () {

        //Route to api to fetch system general information (use when first access to the system, without authentication)
        Route::get('list', ['as' => 'list', 'uses' => 'ProjectController@projects']);

        //Group Project Statistic: api to get statistic data
        Route::group(['as' => 'statistic::', 'prefix' => 'statistic'], function () {
            //Route to api to get statistic data of project base on geo data
            Route::get('geoDistribution', ['as' => 'geoDistribution', 'uses' => 'ProjectStatisticController@geoDistribution']);
        });
    });

    //Group geo: api to get geometry data
    Route::group(['as' => 'geo::', 'namespace' => 'Geo', 'prefix' => 'geo'], function () {

        //Route to api to read geo json of cities
        Route::get('geoJson', ['as' => 'geoJson', 'uses' => 'GeoController@geoJson']);

        //Route to api to get list of cities in system
        Route::get('cities', ['as' => 'cities', 'uses' => 'GeoController@cities']);

        //Route to api to get list of areas in system
        Route::get('areas', ['as' => 'areas', 'uses' => 'GeoController@areas']);

        //Route to api to get list of locality in system
        Route::get('localities', ['as' => 'localities', 'uses' => 'GeoController@localities']);

        //Route to api to get list of route in system
        Route::get('routes', ['as' => 'routes', 'uses' => 'GeoController@routes']);
    });
});
