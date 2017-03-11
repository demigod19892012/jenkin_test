<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/23/15
 * Time: 10:44 PM
 */

namespace App\Model\Table;

use App\Model;
use App\Model\Table\BaseTable;
use App\Model\AddressComponent;
use App\Exceptions\Custom;
use Config;

class AddressTable extends BaseTable
{
    /**
     * @var string: Key for the model name in localization file
     */
    protected $modelNameLocalizationKey = 'Address Component';

    /**
     * Constructor function
     */
    function __construct() {
        parent::__construct();
    }

    /**
     * @return CActiveRecord which model this table working on
     */
    public function model(){
        return (new AddressComponent);
    }

    /**
     * Function to get list of cities in our system
     * @param null $countryCode {string} {optional} If pass in, we will only get that country cities
     * @return mixed {array} list of city object
     */
    public function getCities($countryCode = null){
        try{
            //if country code is passed in , we will only get cities of that country
            if($countryCode){
//                $cityFetcher = $this->query()->with(['parent_component' => function ($query) use ($countryCode) {
//                    $query->where('key', $countryCode);
//                }]);

                $cityFetcher = $this->query()->whereHas('parent_component', function ($query) use ($countryCode) {
                    $query->where('key', $countryCode);
                });
            }
            else{
                $cityFetcher = $this->query();
            }

            $cityFetcher = $cityFetcher->where('type', Config::get('constants.address.administrative_area_level_1'));

            $cityFetcher = $cityFetcher->orderBy('value', 'asc');

            $cities = $cityFetcher->get();

            return $cities;
        }
        catch(Exception $e){
            abort(500, trans('geo.get_city_list_failure'));
        }
    }

    /**
     * Function to get list of areas in our system
     * @param  $cityCodes {array/null} {optional} If pass in, we will only get selected cities areas
     * @return mixed {array} list of locality object
     */
    public function getAreas($cityCodes = null){
        try{
            //if city code is passed in , we will only get localities of that city
            if($cityCodes && is_array($cityCodes) && count($cityCodes) > 0){
                $areaFetcher = $this->query()->whereHas('parent_component', function ($query) use ($cityCodes) {
                    $query->whereIn('key', $cityCodes);
                });
            }
            else{
                $areaFetcher = $this->query();
            }

            $areaFetcher = $areaFetcher->where('type', Config::get('constants.address.administrative_area_level_2'));
            $areaFetcher = $areaFetcher->orderBy('value', 'asc');

            $areas = $areaFetcher->get();

            return $areas;
        }
        catch(Exception $e){
            abort(500, trans('geo.get_area_list_failure'));
        }
    }

    /**
     * Function to get list of locality in our system
     * @param  $areaCodes {array/null} {optional} If pass in, we will only get selected areas localities
     * @return mixed {array} list of locality object
     */
    public function getLocalities($areaCodes = null){
        try{
            //if city code is passed in , we will only get localities of that city
            if($areaCodes && is_array($areaCodes) && count($areaCodes) > 0){
                $localityFetcher = $this->query()->whereHas('parent_component', function ($query) use ($areaCodes) {
                    $query->whereIn('key', $areaCodes);
                });
            }
            else{
                $localityFetcher = $this->query();
            }

            $localityFetcher = $localityFetcher->where('type', Config::get('constants.address.locality'));
            $localityFetcher = $localityFetcher->orderBy('value', 'asc');

            $localities = $localityFetcher->get();

            return $localities;
        }
        catch(Exception $e){
            abort(500, trans('geo.get_locality_list_failure'));
        }
    }

    /**
     * Function to get list of routes in our system
     * @param null $localitiesCode {array/null} {optional} If pass in, we will only get selected localities routes
     * @return mixed {array} list of route object
     */
    public function getRoutes($localitiesCode = null){
        try{
            //if city code is passed in , we will only get localities of that city
            if($localitiesCode){
                $routeFetcher = $this->query()->whereHas('parent_component', function ($query) use ($localitiesCode) {
                    $query->whereIn('key', $localitiesCode);
                });
            }
            else{
                $routeFetcher = $this->query();
            }

            $routeFetcher = $routeFetcher->where('type', Config::get('constants.address.route'));
            $routeFetcher = $routeFetcher->orderBy('value', 'asc');

            $routes = $routeFetcher->get();

            return $routes;
        }
        catch(Exception $e){
            abort(500, trans('geo.get_route_list_failure'));
        }
    }
}