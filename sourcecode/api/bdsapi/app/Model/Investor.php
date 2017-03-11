<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/8/15
 * Time: 12:48 PM
 */

namespace App\Model;

use App\Model\Base\BaseInvestor;
use App\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Exceptions\Custom;
use Config;

class Investor extends BaseInvestor
{
    use SoftDeletes;

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /* ================================= [EXTRA DATA] ================================= */
    /**
     * Get the image object of the given purpose for the project
     * @param $purpose  {string} from constants.image_purpose
     * @return mixed {object/null} the first image model match the condition
     */
    public function image($purpose){
        //get the first image with given type for this project. We wont get deactive image so no need to use Image Table for this
        $pivot = ImageOwn::where('own_object', $this->id)
            ->where('own_object_type', Config::get('constants.object_type.investor'))
            ->where('purpose', $purpose)
            ->first();

        if($pivot){
            return $pivot->image_data;
        }

        return null;
    }

    /**
     * Get the address components for this investor
     * @return array|null
     */
    public function addressComponents(){
        //get the first image with given type for this project. We wont get deactive image so no need to use Image Table for this
        $pivots = ObjectAddress::where('target_object', $this->id)
            ->where('object_type', Config::get('constants.object_type.investor'))
            ->get();

        if($pivots && count($pivots) > 0){
            return $pivots;
        }

        return null;
    }
    /* ================================= [END EXTRA DATA] ================================= */

    /* ================================= [RELATIONS] ================================= */
    /**
     * The projects that belong to the investor.
     */
    public function projects()
    {
        return $this->belongsToMany('App\Model\Project', 'project_investor_mid', 'id', 'project');
    }
    /* ================================= [END RELATIONS] ================================= */

    /**
     * Extent the toArray function
     * @return array
     */
    public function toArray(){
        $array = parent::toArray();

        //we need to add logo of this investor
        $mainImage = $this->image(Config::get('constants.image_purpose.logo'));
        if($mainImage){
            $array['logo'] = $mainImage->toArray();
        }

        $array['total_project'] = $this->projects()->count();
        $array['address_components'] = $this->addressComponents();

        return $array;
    }
}