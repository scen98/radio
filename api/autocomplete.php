<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../apiresponse.php';

$limit = 10;
$keyword = "";
if(isset($_GET["limit"])){
    $limit = (int)$_GET["limit"];
}
if(isset($_GET["keyword"])){
    $keyword = $_GET["keyword"];
}
RequestUtils::checkLimit($limit);
$database = new Database;
$artists = ApiResponse::artistAutoComplete($database, $limit, $keyword,);
$titles = ApiResponse::titleAutoComplete($database, $limit, $keyword);
if(is_null($artists) || is_null($titles)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', array_merge($artists, $titles));