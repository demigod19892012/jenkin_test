<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/10/15
 * Time: 10:53 PM
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
use App\Behavious\Request\FetchBehavious;

class ProjectController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Project Controller
    |--------------------------------------------------------------------------
    |
    | Controller to work with Projects.
    |
    |
    */

    protected $tblProject = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblProject = new ProjectTable();
    }

    /**
     * Api to get list of investor
     * @param Request $request
     * @getParams
     *  sort {string} (optional) field to sort
     *  order {string asc/desc} (optional) order of the sort
     *  offset {int} (optional) offset point for the fetching request
     *  size {int} (optional) maximum number of item for each fetch (also mean as paging)
     * @return mixed
     */
    protected function projects(Request $request){
        $fetch = new FetchBehavious($request, $this->tblProject);
        $fetch->messageFailToFetch = trans('project.fetch_failure');
        $fetch->messageFetchSuccess = trans('project.fetch_success');
        return $fetch->fetchAndResponse();
    }
}