<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$database = new Database;
$numberOfTracks = array('value' => ApiResponse::numberOfTracks($database));
if(is_null($numberOfTracks)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('numberOfTracks', $numberOfTracks);