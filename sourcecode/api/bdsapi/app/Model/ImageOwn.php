<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/13/15
 * Time: 10:50 PM
 */

namespace App\Model;

use App\Model\Base\BaseImageOwn;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;

class ImageOwn extends BaseImageOwn
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
     * The image that this object owned
     */
    public function image_data()
    {
        return $this->belongsTo('App\Model\Image', 'image', 'id');
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