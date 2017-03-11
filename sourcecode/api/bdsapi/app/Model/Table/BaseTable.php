<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 9/14/15
 * Time: 10:42 PM
 */

namespace App\Model\Table;

use Config;
use App\Model;
abstract class BaseTable
{
    /**
     * The attributes that decide if this table will return thrash item or not (soft deleted item)
     * 1: Only non-thrash item
     * 2: Both
     * 3: Only thrash item
     * @var int
     */
    protected $withThrash = 1;

    /**
     * @var string: Name of the private key. Override on each table if it have different key
     */
    protected $privateKey = 'id';

    /**
     * @var string: Key for the model name in localization file (no space)
     */
    protected $modelNameLocalizationKey = 'object';

    /**
     * Constructor function
     */
    function __construct() {

    }

    /**
     * @return CActiveRecord which model this table working on
     */
    public abstract function model();

    /**
     * Generate the query builder
     * @return CActiveRecord
     */
    public function query(){
        if($this->isEnableViewThrash()){
            return $this->model()->withTrashed();
        }
        else if($this->isEnableViewThrashOnly()){
            return $this->model()->onlyTrashed();
        }
        else {
            return $this->model();
        }
    }

    /**
     * Only allow view non-deleted item
     */
    public function disableViewThrash(){
        $this->withThrash = 1;
    }

    /**
     * Is this table only allow view non-deleted item?
     * @return bool
     */
    public function isDisableViewThrash(){
        return ($this->withThrash == 1);
    }

    /**
     * Allow view deleted item
     */
    public function enableViewThrash(){
        $this->withThrash = 2;
    }

    /**
     * Is this table allow view deleted item?
     * @return bool
     */
    public function isEnableViewThrash(){
        return ($this->withThrash == 2);
    }

    /**
     * Only view deleted item
     */
    public function enableViewThrashOnly(){
        $this->withThrash = 3;
    }

    /**
     * Is this table allow view deleted item only?
     * @return bool
     */
    public function isEnableViewThrashOnly(){
        return ($this->withThrash == 3);
    }

    /**
     * Common function to fetch an object by id.
     * @param $id   Id of an object
     * @param bool|false $failIfNotFound If this flag set to true, we will return 404 exception if not found the request object
     * @return null
     */
    public function find($id, $failIfNotFound = false){
        if(!$id){
            if($failIfNotFound){
                abort(404, trans('error.400_not_found_object', ['object_name' => trans('object.'.$this->modelNameLocalizationKey)]));
            }
            return null;
        }

        $entity = $this->query()->where($this->privateKey, $id)->first();

        if($entity){
            return $entity;
        }
        else{
            if($failIfNotFound){
                abort(404, trans('error.400_not_found_object', ['object_name' => trans('object.'.$this->modelNameLocalizationKey)]));
            }
            return null;
        }
    }

    /**
     * Return the total entities in selected table.
     * @Note: the number of entities is decided also by the viewThrash mode of the table.
     * @return mixed number of entities in current table
     */
    public function total(){
        return $this->query()->count();
    }
}
