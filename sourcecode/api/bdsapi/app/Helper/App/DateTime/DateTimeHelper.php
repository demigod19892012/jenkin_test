<?php
namespace App\Helper\App\DateTime;

use Carbon\Carbon;

class DateTimeHelper {

    public function formatMysql(){
        return 'Y-m-d H:i:s';
    }

    /**
     * Return the current time
     * @return static Carbon object of current time
     */
    public function now(){
        return Carbon::now();
    }

    /**
     * Convert to carbon object from mysql datetime value
     * @return static Carbon object of datetime value
     */
    public function fromMysqlDatetime($datetime){
        return Carbon::createFromFormat($this->formatMysql(), $datetime);
    }
}