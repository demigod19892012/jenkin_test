<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/12/15
 * Time: 8:58 PM
 */

return [

    '400' => 'Your request is invalid or contain bad data.',
    '401' => 'Invalid authentication data. Please check your username and password.',
    '403' => 'You dont have permission to view the selected data',
    '404' => 'Cannot find the request data.',
    '405' => 'Method not allowed.',
    '460' => 'The request tenant isnt available. Please recheck to make sure you get the tenant name right.',

    '500' => 'Internal error occurred. Please try again.',

    '400_not_found_object' => 'Cannot find the request :object_name',
    '401_token_expired' => 'Your session have expired. Please sign in again.',
    '401_token_invalid' => 'Your access token is invalid. Please try sign in again',

    '500_fetch_setting_error' => 'Internal error occurred due to invalid fetching setting. Please contact the administrator.'
];