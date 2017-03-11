<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/20/15
 * Time: 10:31 PM
 */

namespace App\Model;

use App\Model\Base\BaseObjectAddress;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;

class ObjectAddress extends BaseObjectAddress
{
    use SoftDeletes;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /* ================================= [RELATIONS] ================================= */
    /**
     * The projects which using image
     */
    public function address_component_data()
    {
        return $this->belongsTo('App\Model\AddressComponent', 'address_component', 'id');
    }
    /* ================================= [END RELATIONS] ================================= */

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArray(){
        $array = parent::toArray();

        $array['address_component_data'] = $this->address_component_data;

        return $array;
    }
}