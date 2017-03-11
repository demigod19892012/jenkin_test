<?php

namespace App\Exceptions;

use Exception;
use App\Exceptions\Custom;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use ResponseHelper;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        HttpException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        if($e instanceOf ModelNotFoundException)
        {
            return ResponseHelper::json(null, [], $e->getMessage(), 404);
        }

        if($e instanceOf Custom\UserAuthenticationFailureException)
        {
            return ResponseHelper::json(null, [], $e->getMessage(), 401);
        }

        if($e instanceOf Custom\AccessTokenExpiredException)
        {
            return ResponseHelper::json(null, [], trans('error.401_token_expired'), 401);
        }

        if($e instanceOf Custom\AccessTokenInvalidException)
        {
            return ResponseHelper::json(null, [], trans('error.401_token_invalid'), 401);
        }

        if($e instanceOf Custom\ValidationException)
        {
            return ResponseHelper::json(null, $e->getErrors(), trans('error.400'), 400);
        }

        if($e instanceOf Custom\FailedToFetchDataException)
        {
            return ResponseHelper::json(null, [], $e->getFetchError(), 500);
        }

        return ResponseHelper::json(null, [], $e->getMessage(), $e->getStatusCode());
        //return parent::render($request, $e);
    }
}
