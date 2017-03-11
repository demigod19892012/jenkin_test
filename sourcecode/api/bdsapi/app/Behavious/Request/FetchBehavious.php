<?php
/**
 * Created by PhpStorm.
 * User: quocviet
 * Date: 11/9/15
 * Time: 11:25 PM
 */

/**
 * Why need to rewrite fetching api over and over again when all the params is almost the same for our system.
 * This class help us reduce the time by creating an object which will fetch and check all the params from request for
 * us and send request to database to get exactly the data we want
 */

namespace App\Behavious\Request;

use Illuminate\Http\Request;
use Auth;
use Mockery\CountValidator\Exception;
use Validator;
use App\Exceptions\Custom;
use ResponseHelper;

class FetchBehavious{

    public $request;                                //request object send from our server
    public $table;                                  //the table object corresponding to the table we want to fetch data from

    public $order;                                  //{string asc/desc} (optional) order of the sort
    public $sort;                                   //{string} (optional) field to sort
    public $size;                                   //{int} (optional) maximum number of item for each fetch (also mean as paging)
    public $offset;                                 //{int} (optional) offset point for the fetching request

    public $messageFailToFetch;                     //message when fetcher fail to fetch any data (due to error or no item)
    public $messageFetchSuccess;                     //message when fetcher successfully getch the request data

    /**
     * Constructor function. You can set data in this construction or can set later
     * @param Request $request
     * @param null $table
     */
    function __construct(Request $request, $table = null) {
        $this->request = $request;
        $this->table = $table;
    }

    /**
     * Fetch data from the database and return to our controller
     * @return array|void result from fetch request
     *  result {bool} success or not (incase of failure, exception will be throwed)
     *  message {string} success message or failure message
     *  data {array} result from fetching
     *  total {int} total items if not apply limit and offset (use to get maximum number of item available with current
     *      request)
     * @throws Custom\ValidationException   If validation not met
     * @throws FailedToFetchDataException   If cannot fetch due to exception
     */
    function fetch(){
        $fetchData = array();
        $total = 0;

        //if this is not set, throw internal error
        if(!$this->request || !$this->table){
            abort(500, trans('error.500_fetch_setting_error'));
        }

        $messages = [
            'sort.in' => trans('validation.sort_in', ['attribute' => 'sort', 'values' => 'asc, desc']),
            'size.numeric' => trans('validation.numeric', ['attribute' => 'size']),
            'offset.numeric' => trans('validation.numeric', ['attribute' => 'offset']),
        ];

        //we need to validate all the data come from the request
        $validator = Validator::make($this->request->all(), [
            'sort' => 'in:asc,desc',
            'size' => 'numeric',
            'offset' => 'numeric',
        ], $messages);

        if ($validator->fails()){
            throw new Custom\ValidationException($validator->errors()->all());
            return;
        }
        else{
            try{
                //get the data from request
                if($this->request->has('order')){
                    $this->order = $this->request->input('order');
                }
                if($this->request->has('sort')){
                    $this->sort = $this->request->input('sort');
                }
                if($this->request->has('size')){
                    $this->size = $this->request->input('size');
                }
                if($this->request->has('offset')){
                    $this->offset = $this->request->input('offset');
                }

                //get the data now
                $fetcher = $this->table->model();
                if($this->order){
                    if($this->sort){
                        $fetcher = $fetcher->orderBy($this->order, $this->sort);
                    }
                    else{
                        $fetcher = $fetcher->orderBy($this->order, 'asc');
                    }
                }

                //the total wont be apply by size and offset so we need to call it before apply those 2
                $total = $fetcher->count();

                //offset can only work if size is set, if size not set, offset always 0
                if($this->size){
                    //if size is <= 0, meaning we want to get all items
                    $fetcher = $fetcher->take($this->size);

                    if($this->size > 0 && $this->offset){
                        $fetcher = $fetcher->skip($this->offset);
                    }
                }

                //get the list of item
                $fetchData = $fetcher->get();
            }
            catch(Exception $e){
                throw new FailedToFetchDataException(($this->messageFailToFetch)?$this->messageFailToFetch:trans('message.fail_to_fetch_items_from_db'));
                return;
            }
        }

        return array(
            'data' => $fetchData,
            'total' => $total,
        );
    }

    /**
     * Call the fetch function and return in json format as an api
     * This function help us reduce time for similar fetch api.
     * @return mixed
     * @throws Custom\ValidationException
     * @throws FailedToFetchDataException
     */
    function fetchAndResponse(){
        $result = $this->fetch();

        $responseData = array(
            'total' => $result['total'],
            'data' => $result['data']
        );
        return ResponseHelper::json(null, $responseData, ($this->messageFetchSuccess)?$this->messageFetchSuccess:trans('message.fetch_items_success_from_db'));
    }

}