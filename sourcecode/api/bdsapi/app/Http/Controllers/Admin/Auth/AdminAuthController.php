<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/10/15
 * Time: 10:47 PM
 */

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Base;
use ResponseHelper;
use App;
use App\Model;
use Config;
use App\Model\Table\UserTable;
use Illuminate\Http\Request;
use Auth;

class AdminAuthController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Admin Auth Controller
    |--------------------------------------------------------------------------
    |
    | This controller handle the request that require to get authentication from administrator user
    |
    */

    protected $tblUser = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblUser = new UserTable();
    }

    /**
     * API to sign into the admin account
     * @httpStatusCode_401: If authentication data is wrong, this exception will be fired
     * @return mixed
     */
    protected function signIn(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');

        $admin = $this->tblUser->authentication($email, $password);

        return ResponseHelper::json(null, $admin->toAuthenticationArray(), trans('message.admin_sign_in_success'));
    }

    /**
     * API to sign out from administrator account
     * @httpStatusCode_401: If the access token is wrong, this exception will be fired
     * @return mixed
     */
    protected function signOut(Request $request){
        $logoutResult = Auth::user()->logout();
        if($logoutResult){
            return ResponseHelper::json(null, array('result' => true), trans('message.admin_sign_out_success'));
        }
        else{
            return ResponseHelper::json(null, array('result' => false), trans('message.admin_sign_out_failure'));
        }
    }
}