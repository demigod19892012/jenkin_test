<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/12/15
 * Time: 9:26 PM
 */

namespace App\Http\Middleware\Request;

use Closure;
use Config;
use App;

class Request
{
    /**
     * Handle when a request is made to the current server
     * We need to set Access-Control-Allow to allow access from outsite
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //We need to set Access-Control-Allow for request from outsite
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With, Language');
        header('Access-Control-Allow-Credentials: true');

        return $next($request);
    }
}