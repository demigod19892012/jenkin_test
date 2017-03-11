<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/8/15
 * Time: 12:48 PM
 */

namespace App\Model;

use App\Model\Base\BaseProject;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;
use Config;
use DateTimeHelper;

class Project extends BaseProject
{
    use SoftDeletes;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /* ================================= [MUTATOR] ================================= */
    public function getEndConstructPlanDateAttribute($value)
    {
        $carbon = DateTimeHelper::fromMysqlDatetime($value);
        return $carbon->format(Config::get('constants.format.date'));
    }

    public function getEndConstructDateAttribute($value)
    {
        $carbon = DateTimeHelper::fromMysqlDatetime($value);
        return $carbon->format(Config::get('constants.format.date'));
    }
    /* ================================= [END MUTATOR] ================================= */

    /* ================================= [EXTRA DATA] ================================= */
    /**
     * Get the image object of the given purpose for the project
     * @param $purpose  {string} from constants.image_purpose
     * @return mixed {object/null} the first image model match the condition
     */
    public function image($purpose){
        //get the first image with given type for this project. We wont get deactive image so no need to use Image Table for this
        $pivot = ImageOwn::where('own_object', $this->id)
            ->where('own_object_type', Config::get('constants.object_type.project'))
            ->where('purpose', $purpose)
            ->first();

        if($pivot){
            return $pivot->image_data;
        }

        return null;
    }

    /**
     * Get the address components for this project
     * @return array|null
     */
    public function addressComponents(){
        //get the first image with given type for this project. We wont get deactive image so no need to use Image Table for this
        $pivots = ObjectAddress::where('target_object', $this->id)
            ->where('object_type', Config::get('constants.object_type.project'))
            ->get();

        if($pivots && count($pivots) > 0){
            return $pivots;
        }

        return null;
    }
    /* ================================= [END EXTRA DATA] ================================= */

    /* ================================= [RELATIONS] ================================= */
    /**
     * The investors that belong to the project.
     */
    public function investors()
    {
        return $this->belongsToMany('App\Model\Investor', 'project_investor_mid', 'id', 'investor');
    }
    /* ================================= [END RELATIONS] ================================= */

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArray(){
        $array = parent::toArray();

        //we need to add image of this image
        $mainImage = $this->image(Config::get('constants.image_purpose.main_image'));
        if($mainImage){
            $array['main_image'] = $mainImage->toArray();
        }

        $array['address_components'] = $this->addressComponents();

        return $array;
    }
}