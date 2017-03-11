<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/13/15
 * Time: 10:50 PM
 */

namespace App\Model;

use App\Model\Base\BaseImage;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;
use DateTimeHelper;

class Image extends BaseImage
{
    use SoftDeletes;

    const IMAGE_ROOT = 'data/images/data';                                 //root folder of common image

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
    public function owners()
    {
        return $this->hasMany('App\Model\ImageOwn', 'image', 'id');
    }
    /* ================================= [END RELATIONS] ================================= */

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArray(){
        $array = parent::toArray();

        $array['abs_url'] = $this->asbUrl();

        return $array;
    }

    /**
     * Get the full url of the image
     * @return {string/null} full url to the image
     */
    public function asbUrl(){
        //By default , the path of the url is decide by the following:
        //root/upload_year/upload_month/upload_day/image_name
        if($this->filename && $this->upload_at){
            $uploadDateCarbon = DateTimeHelper::fromMysqlDatetime($this->upload_at);
            return url('/') . '/' . Image::IMAGE_ROOT . '/' . $uploadDateCarbon->year . '/' . $uploadDateCarbon->month . '/' . $uploadDateCarbon->day . '/' . $this->filename;
        }
        return null;
    }
}