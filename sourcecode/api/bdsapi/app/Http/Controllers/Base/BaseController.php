<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/10/15
 * Time: 10:47 PM
 */

namespace App\Http\Controllers\Base;

use App\Http\Controllers\Controller;
use JWTAuth;
use App\Model\Table\UserTable;
use App\Exceptions\Custom;

class BaseController extends Controller{
    /*
    |--------------------------------------------------------------------------
    | Base Controller
    |--------------------------------------------------------------------------
    |
    | All the controller will extend from this controller
    |
    */

    protected $tblUser = null;                                           //user table

    /**
     * Constructor
     * We need to fetch the current user using the api from the access token (if api require), so we will do that work here
     * @httpStatusCode_401: If the access token is wrong or we cannot find this user, this exception will be fired
     */
    public function __construct()
    {

    }
}