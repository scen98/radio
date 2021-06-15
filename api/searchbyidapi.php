<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$trackID = $_GET['trackid'];
$limit = $_GET['limit'];
RequestUtils::checkID($trackID);
RequestUtils::checkLimit($limit);
$database = new Database;
$records = ApiResponse::searchByID($database, $trackID, $limit);
if(is_null($records)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $records);