<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/8/15
 * Time: 12:54 PM
 */
namespace App\Model\Table;

use App\Model;
use App\Model\Table\BaseTable;
use App\Model\Project;
use App\Exceptions\Custom;
use Config;

class ProjectTable extends BaseTable
{
    /**
     * @var string: Key for the model name in localization file
     */
    protected $modelNameLocalizationKey = 'Project';

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
        return (new Project);
    }
}