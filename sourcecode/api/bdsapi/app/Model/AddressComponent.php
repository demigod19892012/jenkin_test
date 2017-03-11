<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/20/15
 * Time: 10:31 PM
 */

namespace App\Model;

use App\Model\Base\BaseAddressComponent;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;

class AddressComponent extends BaseAddressComponent
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
     * The objects which having this component in its address
     */
    public function object_owns()
    {
        return $this->hasMany('App\Model\ObjectAddress', 'address_component', 'id');
    }

    /**
     * Children components of this address component
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany('App\Model\AddressComponent', 'parent', 'id');
    }

    /**
     * Parent componenet of this address component
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function parent_component()
    {
        return $this->belongsTo('App\Model\AddressComponent', 'parent', 'id');
    }
    /* ================================= [END RELATIONS] ================================= */

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArray(){
        $array = parent::toArray();

        return $array;
    }
}