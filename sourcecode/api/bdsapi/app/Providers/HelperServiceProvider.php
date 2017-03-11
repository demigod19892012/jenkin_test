<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/10/15
 * Time: 11:29 PM
 */

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class HelperServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('ResponseHelper', function()
        {
            return new \App\Helper\App\Response\ResponseHelper;
        });

        $this->app->bind('RequestHelper', function()
        {
            return new \App\Helper\App\Request\RequestHelper;
        });

        $this->app->bind('DateTimeHelper', function()
        {
            return new \App\Helper\App\DateTime\DateTimeHelper;
        });
    }
}
