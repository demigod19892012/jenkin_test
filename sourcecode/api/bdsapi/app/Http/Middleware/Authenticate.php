<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use JWTAuth;
use App\Exceptions\Custom;
use Auth;

class Authenticate
{
    /**
     * Handle an incoming request.
     * Any request with this middleware will check for accessToken available.
     * @Require:
     * Since we are using JWT Library, this function require the accessToken is set to header in format
     * Authorization: Bearer {yourtokenhere}
     *
     * After the middle is called, you can get the user id from Auth::user()->id
     *
     * @param $request
     * @param Closure $next
     * @return null
     * @throws Custom\AccessTokenExpiredException
     * @throws Custom\AccessTokenInvalidException
     */

    public function handle($request, Closure $next)
    {
        try {
            if (! $user = JWTAuth::parseToken()->toUser()) {
                throw new Custom\AccessTokenInvalidException();
                return null;
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            throw new Custom\AccessTokenExpiredException();
            return null;
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            throw new Custom\AccessTokenInvalidException();
            return null;
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
            throw new Custom\AccessTokenInvalidException();
            return null;
        }

        Auth::login($user);

        return $next($request);
    }
}
