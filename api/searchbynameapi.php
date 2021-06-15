<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../track.php';

$term = $_GET['term'];
$limit = $_GET['limit'];
$offset = $_GET['offset'];
$database = new Database;
$tracks = is_null($term) ? Track::newestTracks($database, $limit, $offset) : Track::searchByName($database, $term, $limit, $offset);
if(is_null($tracks)){
    RequestUtils::returnFail();
}
RequestUtils::returnData('records', $tracks);