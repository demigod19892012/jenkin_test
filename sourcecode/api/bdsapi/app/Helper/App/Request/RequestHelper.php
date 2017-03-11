<?php
namespace App\Helper\App\Request;

class RequestHelper {

    /**
     * Helper function to convert the input (which expect an array or json) into an object
     * @param $input    {array/json} The input data
     * @return mixed    Object after convert from json or array
     */
    public function getJsonInput($input)
    {
        if(is_array($input)){
            return $input;
        }
        else{
            return json_decode($input);
        }
    }

    /**
     * itemlist input will have format like: item[separator]item, we will convert it into array
     * @param $input    {string} The input data
     * @param string $separator    {string} Separator character
     * @return array|null    Object after convert from json or array
     */
    public function fromItemListInput($input, $separator = ',')
    {
        if(!$input || !$separator){
            return null;
        }
        return explode($separator, $input);
    }

}