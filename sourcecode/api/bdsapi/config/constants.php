<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/12/15
 * Time: 9:40 PM
 */

return [
    /*
     * Hold all the format
     */
    'format' => [
        'date' => 'd-m-Y',
    ],

    /*
     * Hold the key value for user authentication type
     */
    'authority' => [
        'user' => 1,
        'admin' => 2,
    ],

    /*
     * Hold all the key constrain (use for array for key)
     */
    'key' => [
        'session' => [
            'lang' => 'language',
        ]
    ],

    /*
     * Hold all the predefine value for status
     */
    'status' => [
        'active' => 2,
        'de_active' => 1,
    ],

    /*
     * Define land type
     */
    'land_type' => [
        'apartment' => 1,
        'house' => 2,
        'mansion' => 3,
    ],

    /*
     * Define the category for image
     */
    'image_category' => [
        'project' => 1,
        'investor' => 2,
    ],

    /*
     * Define the object type, we will use this to get image base on object type field
     */
    'object_type' => [
        'project' => 'project',
        'investor' => 'investor',
    ],

    /*
     * Define the image purpose, we will use this to get image base on object type field
     */
    'image_purpose' => [
        'main_image' => 'main_image',
        'logo' => 'logo',
    ],

    /*
     * Define all the component which make up a location or address (base on google)
     * We dont save coordinate, it will save into object (this kind of data dont duplicate, so saving it is not
     * a good pratice
     * In this project we dont need street_number due to the size of project
     */
    'address' => [
        'postal_code' => 'postal_code',
        'country' => 'country',
        'administrative_area_level_1' => 'administrative_area_level_1',
        'administrative_area_level_2' => 'administrative_area_level_2',
        'locality' => 'locality',
        'route' => 'route',
        'street_number' => 'street_number',
    ],

    /*
     * Code of country in the world
     */
    'country_code' => [
        'vn' => 'vn'
    ]
];