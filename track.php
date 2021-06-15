<?php
require_once 'config.php';
class Track {

    public $trackID;
    public $artist;
    public $title;
    public $date_added;

    function __construct($trackID, $artist, $title, $date_added = NULL){
        $this->trackID = $trackID;
        $this->artist = $artist;
        $this->title = $title;
        $this->date_added = $date_added;
    }

    public static function updateTrack($database, $track){
        $query = "INSERT INTO tracks (trackID, artist, title, date_added) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE artist = ?, title = ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;   
        }
        mysqli_stmt_bind_param($stmt, "isssss", $track->trackID, $track->artist, $track->title, date_format($track->date_added,Config::$mysqlDatetimeFormat), $track->artist, $track->title);
        if(mysqli_stmt_execute($stmt)){
            return true;
        }
        return false;
    }

    public static function updateNextTrack($database, $nextTrack){
        //$query = "INSERT INTO nexttrack (trackID, artist, title, date) VALUES (?, ?, ?, ?)";    // Uncomment if table is empty or new, recomment after the script run ONCE.
        $query = "UPDATE nexttrack SET trackID = ?, artist = ?, title = ?, date = ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;   
        }
        mysqli_stmt_bind_param($stmt, "isss", $nextTrack->trackID, $nextTrack->artist, $nextTrack->title, date_format($nextTrack->date_added,Config::$mysqlDatetimeFormat));
        if(mysqli_stmt_execute($stmt)){
            return true;
        }
        return false;
    }

    public static function newestTracks($database, $limit, $offset = 0){
        $newestTracks = array();
        $query = "SELECT * FROM tracks ORDER BY date_added DESC LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newTrack = new Track($row["trackID"], $row["artist"], $row["title"], $row["date_added"]);
            array_push($newestTracks, $newTrack);
        }
        return $newestTracks;
    }

    public static function searchByName($database, $term, $limit = 1000, $offset = 0){
        $tracks = array();
        $query = "SELECT * FROM tracks WHERE CONCAT(tracks.artist, ' - ', tracks.title) LIKE CONCAT('%',?,'%') ORDER BY date_added DESC LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "sii", $term, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newTrack = new Track($row["trackID"], $row["artist"], $row["title"], $row["date_added"]);
            array_push($tracks, $newTrack);
        }
        return $tracks;
    }

    public static function processPost($receivedPost, $previousTrack, $trackType){
        $defaultTrack = new Track(Config::$defaultID, Config::$stationName, Config::$stationSlogan, $receivedPost->date_added);
        switch($trackType){
            case 4:
                if($previousTrack->trackID == Config::$defaultID){
                    return false;
                }else{
                    return $defaultTrack;
                }
            break;
            case 6:
                if(in_array($previousTrack->trackID, [Config::$otherTypeIDOne, Config::$otherTypeIDTwo], true)){
                    return false;
                }else{
                    $weekday = date_format($receivedPost->date_added, 'w');   // w is numeric representation of a day: 0 for Sunday, 6 for Saturday
                    if(in_array($weekday, Config::$otherTypeOneArray)){
                        return $processedPost = new Track(Config::$otherTypeIDOne, Config::$stationName, Config::$otherTypeTitleOne, $receivedPost->date_added);
                    }else{
                        return $processedPost = new Track(Config::$otherTypeIDTwo, Config::$stationName, Config::$otherTypeTitleTwo, $receivedPost->date_added);
                    }
                }
            break;
            case 5:
                if(in_array($previousTrack->trackID, [Config::$firstTimeWindowIDOne, Config::$firstTimeWindowIDTwo, Config::$defaultStreamID], true) || in_array($previousTrack->trackID, range(Config::$secondTimeWindowID,Config::$secondTimeWindowID + 6), true)){
                    return false;
                }else{
                    $timeToBeChecked = date_modify($receivedPost->date_added, date('Y-m-d'));   // Change whatever post date was received to current date, this way we only compare the times.
                    $weekday = date_format($receivedPost->date_added, 'w');   // w is numeric representation of a day: 0 for Sunday, 6 for Saturday
                    if($timeToBeChecked > RequestUtils::objectifyDateTime(Config::$firstTimeWindowLOWER, 'time') && $timeToBeChecked < RequestUtils::objectifyDateTime(Config::$firstTimeWindowUPPER, 'time')){
                        if(in_array($weekday, Config::$firstTimeWindowArray)){
                            return $processedPost = new Track(Config::$firstTimeWindowIDOne, Config::$stationName, Config::$firstTimeWindowTitleOne, $receivedPost->date_added);
                        }else{
                            return $processedPost = new Track(Config::$firstTimeWindowIDTwo, Config::$stationName, Config::$firstTimeWindowTitleTwo, $receivedPost->date_added);
                        }
                    }else if($timeToBeChecked > RequestUtils::objectifyDateTime(Config::$secondTimeWindowLOWER, 'time') && $timeToBeChecked < RequestUtils::objectifyDateTime(Config::$secondTimeWindowUPPER, 'time')){
                        $newID = Config::$secondTimeWindowID + $weekday;
                        return $processedPost = new Track($newID, Config::$stationName, Config::$secondTimeWindowTitle, $receivedPost->date_added);
                    }else{
                        return $defaultLive = new Track(Config::$defaultStreamID, Config::$stationName, Config::$defaultStreamTitle, $receivedPost->date_added);
                    }
                }
            break;
            default:
                if($previousTrack->trackID == Config::$defaultID && (!$receivedPost->artist || !$receivedPost->title)){
                    return false;
                }else if(!$receivedPost->artist || !$receivedPost->title){
                    return $defaultTrack;
                }else if($previousTrack->trackID == $receivedPost->trackID){
                    return false;
                }else{
                    return $receivedPost;
                }
            break;
        }
    }
}