<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 12/8/15
 * Time: 10:21 PM
 */

namespace App\Model\Table;

use App\Model;
use App\Model\ObjectAddress;
use App\Model\Project;
use App\Exceptions\Custom;
use Config;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Auth;
use DB;

class ProjectGeoStatisticTable
{
    /**
     * Function to get the distribution of the projects across the country. The data return include:
     *  - Total number of project (actived only) for each city
     *  - Each city will have one project attached to it, which is the most viewed project
     * @param $countryCode {string} Country code of the country we want to get distribution data (null will get all cities on the world)
     * @return mixed
     */
    public function geoDistribution($countryCode){
        //first we get the distribution data
        $staticFetcher = DB::table('address_component')
            ->leftJoin('address_component as parent', function($join){
                $join->on('address_component.parent', '=', 'parent.id');
            })
            ->leftJoin('object_address', function ($join) {
                $join->on('address_component.id', '=', 'object_address.address_component');
                $join->on('object_address.object_type', '=', DB::raw("'".Config::get('constants.object_type.project')."'"));
            })
            ->leftJoin('project', function ($join) {
                $join->on('object_address.target_object', '=', 'project.id');
            });

        $staticFetcher = $staticFetcher->groupBy('address_component.id');

        $staticFetcher = $staticFetcher->where('address_component.type', Config::get('constants.address.administrative_area_level_1'));
        $staticFetcher = $staticFetcher->where('parent.key', $countryCode);
        $staticFetcher = $staticFetcher->orderBy('project.view_count', 'DESC');
        $statistic = $staticFetcher->get([
            'address_component.id',
            'address_component.value',
            'address_component.non_unicode_value',
            'address_component.key',
            DB::raw('COUNT(tbl_project.id) as total_project')
        ]);

        return $statistic;
    }

    /**
     * Get the most view project for givent component
     * @param $componentId  {int} primary key of the component
     * @return project|null
     */
    public function mostViewProjectInComponent($componentId){
        if(!$componentId){
            return null;
        }

        //get the ObjectAddress
        return Project::whereIn('id', function($query) use ($componentId){
            $query->select('target_object')
                ->from(with(new ObjectAddress())->getTable())
                ->where('address_component', $componentId)
                ->where('object_type', Config::get('constants.object_type.project'));
        })
            ->orderBy('view_count', 'desc')
            ->first();
    }
}