<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 12/7/15
 * Time: 9:37 PM
 */

namespace App\Http\Controllers\Bds\Project;

use App\Http\Controllers\Base;
use ResponseHelper;
use App;
use App\Model;
use Config;
use Auth;
use Illuminate\Http\Request;
use App\Model\Table\ProjectTable;
use App\Model\Table\ProjectGeoStatisticTable;
use App\Behavious\Request\FetchBehavious;
use App\Model\AddressComponent;
use DB;

class ProjectStatisticController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Project Controller
    |--------------------------------------------------------------------------
    |
    | Controller to work with Project statistic number
    |
    |
    */

    protected $tblProject = null;
    protected $tblGeoProjectStatistic = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblProject = new ProjectTable();
        $this->tblGeoProjectStatistic = new ProjectGeoStatisticTable();
    }

    /**
     * Api to get the distribution of the projects across the country. The data return include:
     *  - Total number of project (actived only) for each city
     *  - Get the top 12 cities which have most projects, and return top view project for each city
     * @param Request $request
     * @getParams
     *  country {string} (optional) Country code of the country we want to get distribution data (null will get all cities on the world)
     * @return mixed
     */
    protected function geoDistribution(Request $request){
        $country_code = $request->input('country');

        //first we get the statistic data
        $statistic = $this->tblGeoProjectStatistic->geoDistribution($country_code);

        //next we get the top 12 cities (by total project) and get top view project for each cities
        $limit = 12;
        if(count($statistic) < $limit){
            $limit = count($statistic);
        }

        if($limit){
            for($i = 0; $i < $limit; $i++){
                $componentData = $statistic[$i];
                if($componentData->id){
                    $project = $this->tblGeoProjectStatistic->mostViewProjectInComponent($componentData->id);
                    if($project){
                        $componentData->most_view_project = $project;
                    }
                }
            }
        }

        $responseData = $statistic;

        return ResponseHelper::json(null, $responseData, trans('project.get_geo_distribution_success'));
    }
}