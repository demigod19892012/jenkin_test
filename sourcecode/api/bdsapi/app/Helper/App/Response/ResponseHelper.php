<?php
namespace App\Helper\App\Response;

class ResponseHelper {

    /**
     * The function to return data in json format.
     * This format is custom to match this project need with data like following:
     * [
     * message: contain the message you want to send
     * timezone: the request timezone (timezone of the requester, get from setting or default if not token is set)
     * language: the request language (language of the requester, get from setting or default if not token is set)
     * data: the json data
     * ]
     * @param string $token If token is not set, the request will get timezone and language from system default. Otherwise, it get from that user setting
     * @param array $data
     * @param string $message Will be translated in this function
     * @param int $status
     * @param array $headers
     * @param int $options
     * @return \Illuminate\Http\JsonResponse
     */
    public function json($token = null, $data = [], $message = '', $status = 200, array $headers = [], $options = 0)
    {
        $resultMessage = $message;
        //if the message is not set, and the code is different from 200, we will automatically fill the message
        if(!$message || strlen(trim($message)) == 0){
            if($status != 200){
                $resultMessage = trans('error.'.$status);
            }
        }

        $response = [
            'language' => null,
            'timezone' => null,
            'response_status' => $status,
            'message' => $resultMessage,
            'data' => $data,
        ];
        $response = response()->json($response, $status, $headers, $options);
        $response->header('Content-Type', 'application/json');
        $response->header('charset', 'utf-8');
        $response->setJsonOptions(JSON_UNESCAPED_UNICODE);

        return $response;
    }

}