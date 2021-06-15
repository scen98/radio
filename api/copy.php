<?php
require_once '../DBINFO.php';
require_once '../requestUtils.php';
require_once '../track.php';

$database = new Database;
$allTracks = Track::newestTracks($database, 100000);
if(is_null($allTracks)){
    RequestUtils::returnFail();
}

foreach($allTracks as &$track){
    $old = "../".$track->image;
    $new = "../album_art_new/".$track->trackID.".jpg";
    copy($old, $new);
}

echo "ye.";