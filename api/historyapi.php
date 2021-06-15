<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$limit = $_GET['limit'];
$date = null;
$offset = 0;
$keyword = "";
if(isset($_GET["offset"])){
    $offset = (int)$_GET["offset"];
}
if(isset($_GET["keyword"]) && $_GET["keyword"] !== "null"){
    $keyword = $_GET["keyword"];
}

RequestUtils::checkLimit($limit);
$database = new Database;
if(!is_null($_GET["date"]) && $_GET["date"] !== "" && $_GET["date"] !== "null"){
    $date = urldecode($_GET["date"]);
    $history = ApiResponse::returnHistoryByDate($database, $limit, $offset, $keyword, $date);
} else {
    $history = ApiResponse::returnHistory($database, $limit, $offset, $keyword);
}

if(is_null($history)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $history);