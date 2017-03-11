<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/25/15
 * Time: 9:30 PM
 */

namespace App\Exceptions\Custom;

class ValidationException extends \Exception
{
    protected $errors;

    public function __construct($errors)
    {
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}