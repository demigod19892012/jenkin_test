<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/12/15
 * Time: 9:26 PM
 */

namespace App\Http\Middleware;

use Closure;
use Config;
use App;

class Localization
{
    /**
     * Language: If token param is not set, using application default, otherwise, set to that user prefer language.
     * If user dont have prefer language, then using that tenant default language.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        //when a request comming, we check the header for language, if request, set the current language to that in request
        $language = $request->headers->get('Language');
        if($language && strcmp(trim($language), '') != 0){
            //save into session
            session([Config::get('constants.key.session.lang') => $language ]);
        }
        //if request header dont have language, we check in the session
        else{
            //first we check the session for language
            $language = null;
            if ($request->session()->has(Config::get('constants.key.session.lang'))) {
                $language = session(Config::get('constants.key.session.lang'));
            }
            else{
                //cannot found it in the session, check the db if token is set
                if ($request->has('token')) {
                    $token = $request->input('token');
                    if($token){
                        //get the language in the setting and save to session
                        $language = 'vi';

                        session([Config::get('constants.key.session.lang') => $language ]);
                    }
                }
            }
        }

        if($language){
            //set language
            App::setLocale($language);
        }
        else{
            //do nothing as we will use the default language
        }

        return $next($request);
    }
}