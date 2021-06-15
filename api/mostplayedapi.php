<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$limit = $_GET['limit'];
$from = "1970-01-01";
if(isset($_GET["from"])){
    $from = $_GET["from"];
}
RequestUtils::checkLimit($limit);
$database = new Database;
$tracks = ApiResponse::mostPlayed($database, $limit, $from);
if(is_null($tracks)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $tracks);