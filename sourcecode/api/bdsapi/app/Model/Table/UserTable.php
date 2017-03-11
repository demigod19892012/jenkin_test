<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/14/15
 * Time: 10:42 PM
 */

namespace App\Model\Table;

use App\Model;
use App\Model\Table\BaseTable;
use App\Model\User;
use App\Exceptions\Custom;
use Config;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Auth;

class UserTable extends BaseTable
{
    /**
     * @var string: Key for the model name in localization file
     */
    protected $modelNameLocalizationKey = 'User';

    /**
     * Constructor function
     */
    function __construct() {
        parent::__construct();
    }

    /**
     * @return CActiveRecord which model this table working on
     */
    public function model(){
        return (new User);
    }

    /**
     * The function to get user using authentication data
     * @param $email  User email
     * @param $password User password
     * @return null
     * @throws Custom\UserAuthenticationFailureException
     */
    public function authentication($email, $password){
        //if any of the data is missing, exception will happen
        if(!$email || !$password){
            throw new Custom\UserAuthenticationFailureException();
            return null;
        }

        $user = $this->query()->where('email', $email)->first();

        if(!$user){
            throw new Custom\UserAuthenticationFailureException();
            return null;
        }

        if (!Hash::check($password, $user->password)) {
            throw new Custom\UserAuthenticationFailureException();
            return null;
        }

        return $user;
    }
}
