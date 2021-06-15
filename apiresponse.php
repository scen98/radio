<?php
require_once 'config.php';
class ApiResponse {

    public $trackID;
    public $artist;
    public $title;
    public $date_played;
    public $date_added;
    public $ID;
    public $value;

    function __construct($trackID = NULL, $artist = NULL, $title = NULL, $date_played = NULL, $date_added = NULL, $ID = NULL, $value = NULL){
        $this->trackID = $trackID;
        $this->artist = $artist;
        $this->title = $title;
        $this->date_played = $date_played;
        $this->date_added = $date_added;
        $this->ID = $ID;
        $this->value = $value;
    }

    public static function artistAutoComplete($database, $limit = 10, $keyword){
        $records = array();
        $query = "SELECT tracks.artist FROM tracks
                    WHERE tracks.artist LIKE CONCAT('%',?,'%')
                    LIMIT ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "si", $keyword, $limit);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            array_push($records, $row["artist"]);
        }
        return $records;
    }

    public static function titleAutoComplete($database, $limit = 10, $keyword){
        $records = array();
        $query = "SELECT CONCAT(tracks.artist, ' - ', tracks.title) as title FROM tracks
                    WHERE CONCAT(tracks.artist, ' - ', tracks.title) LIKE CONCAT('%',?,'%')
                    LIMIT ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "si", $keyword, $limit);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            array_push($records, $row["title"]);
        }
        return $records;
    }

    public static function returnHistory($database, $limit, $offset = 0, $keyword = ""){
        $records = array();
        $query = "SELECT history.*, tracks.artist, title, date_added 
                    FROM history LEFT JOIN tracks on history.trackID=tracks.trackID
                    WHERE CONCAT(tracks.artist, ' - ', tracks.title) LIKE CONCAT('%',?,'%')
                    ORDER BY ID DESC 
                    LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "sii", $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newRecord = new ApiResponse($row["trackID"], $row["artist"], $row["title"], $row["date_played"], $row["date_added"], $row["ID"]);
            array_push($records, $newRecord);
        }
        return $records;
    }

    public static function returnHistoryByDate($database, $limit, $offset = 0, $keyword = "", $date){
        $records = array();
        $query = "SELECT history.*, tracks.artist, title, date_added
                    FROM history LEFT JOIN tracks on history.trackID=tracks.trackID
                    WHERE DATE(history.date_played) = ? AND CONCAT(tracks.artist, ' - ', tracks.title) LIKE CONCAT('%',?,'%')
                    ORDER BY ID DESC
                    LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "ssii", $date, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newRecord = new ApiResponse($row["trackID"], $row["artist"], $row["title"], $row["date_played"], $row["date_added"], $row["ID"]);
            array_push($records, $newRecord);
        }
        return $records;
    }

    public static function mostPlayed($database, $limit, $from){
        $tracks = array();
        $counter = 0;
        $query = "SELECT COUNT(history.trackID) AS numberOfPlays, tracks.*
                    FROM history 
                    LEFT JOIN tracks on history.trackID=tracks.trackID
                    WHERE history.date_played > ?
                    GROUP BY trackID
                    ORDER BY numberOfPlays DESC
                    LIMIT ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "si", $from, $limit);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newTrack = new ApiResponse($row["trackID"], $row["artist"], $row["title"], NULL, $row["date_added"], $counter, $row["numberOfPlays"]);
            array_push($tracks, $newTrack);
            $counter++;
        }
        return $tracks;
    }

    public static function returnNextTrack($database){
        $query = "SELECT * FROM nexttrack";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
		return $nextTrack = new ApiResponse($row["trackID"], $row["artist"], $row["title"], $row["date"], NULL, 0);
    }

    public static function searchByID($database, $trackID, $limit){
        $records = array();
        $query = "SELECT (SELECT COUNT(ID) FROM history WHERE trackID = ?) AS numberOfPlays, history.*, tracks.artist, title, date_added
                    FROM history LEFT JOIN tracks on history.trackID=tracks.trackID
                    WHERE history.trackID = ?
                    ORDER BY history.ID DESC
                    LIMIT ?";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "iii", $trackID, $trackID, $limit);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
			$newRecord = new ApiResponse($row["trackID"], $row["artist"], $row["title"], $row["date_played"], $row["date_added"], $row["ID"], $row["numberOfPlays"]);
            array_push($records, $newRecord);
        }
        return $records;
    }

    public static function numberOfTracks($database){
        $query = "SELECT COUNT(*) AS numberOfTracks FROM tracks";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
		return $row["numberOfTracks"];
    }
}