<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/9/15
 * Time: 11:07 PM
 */

namespace App\Http\Controllers\Bds\Investor;

use App\Http\Controllers\Base;
use ResponseHelper;
use App;
use App\Model;
use Config;
use Auth;
use Illuminate\Http\Request;
use App\Model\Table\InvestorTable;
use App\Behavious\Request\FetchBehavious;

class InvestorController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Investor Controller
    |--------------------------------------------------------------------------
    |
    | Controller to work with Investors.
    |
    |
    */

    protected $tblInvestor = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblInvestor = new InvestorTable();
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
    protected function investors(Request $request){
        $fetch = new FetchBehavious($request, $this->tblInvestor);
        $fetch->messageFailToFetch = trans('investor.fetch_failure');
        $fetch->messageFetchSuccess = trans('investor.fetch_success');
        return $fetch->fetchAndResponse();
    }
}