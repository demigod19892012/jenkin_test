<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/10/15
 * Time: 9:37 PM
 */

namespace App\Exceptions\Custom;

class FailedToFetchDataException extends \Exception
{
    protected $fetchErrorMessage;

    public function __construct($message)
    {
        $this->fetchErrorMessage = $message;
    }

    public function getFetchError()
    {
        return $this->fetchErrorMessage;
    }

}