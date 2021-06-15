<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$pagedata = array();
$database = new Database;
$nextTrack = ApiResponse::returnNextTrack($database);
array_push($pagedata, $nextTrack);
$history = ApiResponse::returnHistory($database, 6);
for ($i = 0; $i < 6; $i++){
    array_push($pagedata, $history[$i]);
}
if(is_null($pagedata)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $pagedata);