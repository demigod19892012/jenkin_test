<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/28/15
 * Time: 4:57 PM
 */

namespace App\Facades\App\Helper\Request;
use Illuminate\Support\Facades\Facade;

class RequestHelper extends Facade{
    protected static function getFacadeAccessor() { return 'RequestHelper'; }
}