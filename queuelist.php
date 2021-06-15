<?php
require_once 'config.php';
require_once 'requestUtils.php';
class Queuelist{

    public $ID;
    public $trackID;
    public $eta;
    public $artist;
    public $title;

    function __construct($ID, $trackID, $eta, $artist, $title){
        $this->ID = $ID;
        $this->trackID = $trackID;
        $this->eta = $eta;
        $this->artist = $artist;
        $this->title = $title;	
    }

    public static function returnQueuelist($database){
        $queuelist = array();
        $query = "SELECT ID, songID, ETA, artist, title FROM queuelist";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            $newDate = RequestUtils::objectifyDateTime($row["ETA"], 'mysql');
            $newItem = new Queuelist($row["ID"], $row["songID"], $newDate, $row["artist"], $row["title"]);
            array_push($queuelist, $newItem);
        }
        return $queuelist;
    }

    public static function processQueuelist($remoteDatabase, $queuelist){
        $counter = 0;
        $numberOfRows = count($queuelist);
        $trackType;
        if(!isset($queuelist) || empty($queuelist)){
            $defaultDate = RequestUtils::objectifyDateTime(Config::$defaultTime, 'time');
            return $nextTrack = new Track(Config::$defaultID, Config::$stationName, Config::$stationSlogan, $defaultDate);
        }
        do{
            if($counter >= $numberOfRows) {
                $defaultDate = RequestUtils::objectifyDateTime(Config::$defaultTime, 'time');
                $nextTrack = new Track(Config::$defaultID, Config::$stationName, Config::$stationSlogan, $defaultDate);
                break;
            }
            $query = "SELECT ID, song_type FROM songs WHERE ID = " . $queuelist[$counter]->trackID;
            $stmt = mysqli_stmt_init($remoteDatabase->conn);
            if(!mysqli_stmt_prepare($stmt, $query)){
                return NULL;
            }
            if(!mysqli_stmt_execute($stmt)){
                return NULL;
            }
            $result = mysqli_stmt_get_result($stmt);
            while($row = mysqli_fetch_assoc($result)){
                $nextTrack = new Track($row["ID"], $queuelist[$counter]->artist, $queuelist[$counter]->title, $queuelist[$counter]->eta);
                $trackType = $row["song_type"]; 
            }
            $counter++;
        }while(!in_array($trackType, Config::$allowedNextTrackTypes));
        switch($trackType){
            case 5:
                $nextTrack->trackID = Config::$defaultStreamID;
                $nextTrack->artist = Config::$stationName;
                $nextTrack->title = Config::$stationSlogan;
            break;
            case 6:
                $weekday = date_format($nextTrack->date_added, 'w');   // w is numeric representation of a day: 0 for Sunday, 6 for Saturday
                if(in_array($weekday, Config::$otherTypeOneArray)){
                    $nextTrack->trackID = Config::$otherTypeIDOne;
                    $nextTrack->artist = Config::$stationName;
                    $nextTrack->title = Config::$otherTypeTitleOne;
                }else{
                    $nextTrack->trackID = Config::$otherTypeIDTwo;
                    $nextTrack->artist = Config::$stationName;
                    $nextTrack->title = Config::$otherTypeTitleTwo;
                }
            break;
        }
        return $nextTrack;
    }
}