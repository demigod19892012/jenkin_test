<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/23/15
 * Time: 11:08 PM
 */

namespace App\Http\Controllers\Bds\Geo;

use App\Http\Controllers\Base;
use ResponseHelper;
use RequestHelper;
use App;
use App\Model;
use Config;
use Auth;
use Storage;
use Illuminate\Http\Request;
use App\Model\Table\AddressTable;
use App\Behavious\Request\FetchBehavious;

class GeoController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Investor Controller
    |--------------------------------------------------------------------------
    |
    | Controller to work with Investors.
    |
    |
    */

    protected $tblAddress = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblAddress = new AddressTable();
    }

    /**
     * Api to get geoJson for selected country
     * @param Request $request
     * @getParams
     *  country {string} (optional) code of the country we want to get geoJson Data
     * @return mixed
     */
    protected function geoJson(Request $request){
        $country_code = $request->input('country');

        $responseData = null;

        if($country_code && strcmp(strtolower($country_code), Config::get('constants.country_code.vn')) == 0){
            $responseData = Storage::disk('local')->get('json/geoJson/vn-vn.json');
        }
        else{
            $responseData = '';
        }

        return $responseData;
    }

    /**
     * Api to get list of cities in our system
     * @param Request $request
     * @getParams
     *  country {string} (optional) code of the country we want to get list of cities. If null, return all cities in the world
     * @return mixed
     */
    protected function cities(Request $request){
        $country_code = $request->input('country');
        $cities = $this->tblAddress->getCities($country_code);

        $responseData = array(
            'total' => count($cities),
            'data' => $cities
        );
        return ResponseHelper::json(null, $responseData, trans('geo.get_city_list_success'));
    }

    /**
     * Api to get list of areas in our system
     * @param Request $request
     * @getParams
     *  cities {list string} {area1,area2} (optional) code of the cities we want to get list of areas. If null, return all areas in the world
     * @return mixed
     */
    protected function areas(Request $request){
        $citiesList = $request->input('cities');
        $cities = RequestHelper::fromItemListInput($citiesList);
        $areas = $this->tblAddress->getAreas($cities);

        $responseData = array(
            'total' => count($areas),
            'data' => $areas,
        );
        return ResponseHelper::json(null, $responseData, trans('geo.get_area_list_success'));
    }

    /**
     * Api to get list of localities in our system
     * @param Request $request
     * @getParams
     *  areas {list string} {area1,area2} (optional) code of the areas we want to get list of localities. If null, return all localities in the world
     * @return mixed
     */
    protected function localities(Request $request){
        $areaList = $request->input('areas');
        $areas = RequestHelper::fromItemListInput($areaList);
        $localities = $this->tblAddress->getLocalities($areas);

        $responseData = array(
            'total' => count($localities),
            'data' => $localities,
        );
        return ResponseHelper::json(null, $responseData, trans('geo.get_locality_list_success'));
    }

    /**
     * Api to get list of routes in our system
     * @param Request $request
     * @getParams
     *  locality {list string} {loca1,loca2} (optional) code of the localities we want to get list of routes. If null, return all routes in the world
     * @return mixed
     */
    protected function routes(Request $request){
        $localityList = $request->input('localities');
        $localities = RequestHelper::fromItemListInput($localityList);
        $routes = $this->tblAddress->getRoutes($localities);

        $responseData = array(
            'total' => count($routes),
            'data' => $routes
        );
        return ResponseHelper::json(null, $responseData, trans('geo.get_route_list_success'));
    }
}