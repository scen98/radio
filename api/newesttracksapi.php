<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../track.php';

$limit = $_GET['limit'];
RequestUtils::checkLimit($limit);
$database = new Database;
$newestTracks = Track::newestTracks($database, $limit);
if(is_null($newestTracks)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $newestTracks);