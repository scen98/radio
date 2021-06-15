<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../track.php';

$database = new Database;
$newestTracks = Track::newestTracks($database, 1000000);
if(is_null($newestTracks)){
    RequestUtils::returnFail();
}
$fileNames = scandir("../album_art");
$results = [];
foreach($newestTracks as &$track){
    if(!in_array(strval($track->trackID).".jpg", $fileNames)){
        array_push($results, $track);
    }
}

RequestUtils::returnData('records', $results);