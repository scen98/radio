<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$limit = $_GET['limit'];
RequestUtils::checkLimit($limit);
$database = new Database;
$history = ApiResponse::returnHistory($database, $limit);
if(is_null($history)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $history);