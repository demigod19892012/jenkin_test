<?php

namespace App\Model;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use App\Model\Base\BaseUser;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Exceptions\Custom;

class User extends BaseUser implements AuthenticatableContract
{
    use SoftDeletes;
    use Authenticatable;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['password'];

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArrayWithData(){
        $array = parent::toArray();

        return $array;
    }

    /**
     * This function will include the access token
     * @return array
     */
    public function toAuthenticationArray(){
        $array = $this->toArrayWithData();

        $token = $this->generateToken();

        //failed to create token? Throw the exception
        if(!$token){
            throw new Custom\UserAuthenticationFailureException();
            return null;
        }

        $array['access_token'] = $token;

        return $array;
    }

    /**
     * Generate access token for the current user.
     * @Require: JWT library
     */
    public function generateToken(){
        try {
            $token = JWTAuth::fromUser($this);
            if($token){
                //save the token to database
                $this->access_token = $token;
                $this->save();
            }
            return $token;
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return null;
        }
    }

    /**
     * Logout user from the session. Actually we just remove its access token
     */
    public function logout(){
        try {
            $this->access_token = null;
            return $this->save();
        } catch (Exception $e) {
            abort(500, trans('error.500'));
            return false;
        }
    }
}
