<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/8/15
 * Time: 8:28 PM
 */

namespace App\Http\Controllers\Bds\Stat;

use App\Http\Controllers\Base;
use ResponseHelper;
use App;
use App\Model;
use Config;
use App\Model\Table\InvestorTable;
use App\Model\Table\ProjectTable;
use Auth;
use Illuminate\Http\Request;

class StatController extends Base\BaseController{
    /*
    |--------------------------------------------------------------------------
    | Stat Controller
    |--------------------------------------------------------------------------
    |
    | This controller help us get all the stat of our system, for example how many investors, how many projects,...
    |
    |
    */

    protected $tblInvestor = null;
    protected $tblProject = null;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        $this->tblInvestor = new InvestorTable();
        $this->tblProject = new ProjectTable();
    }

    /**
     * Api to get the site status.
     * @data:
     *  1.Number of project
     *  2.Number of investor
     * @return mixed
     */
    protected function siteStat(Request $request){
        $data = array(
            'total_project' => $this->tblProject->total(),
            'total_investor' => $this->tblInvestor->total(),
        );

        return ResponseHelper::json(null, $data, trans('message.site_stat_fetch_success'));
    }
}