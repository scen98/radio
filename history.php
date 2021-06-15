<?php
require_once 'config.php';
class History {
    
    public $trackID;
    public $date_played;
    public $ID;

    function __construct($trackID, $date_played, $ID = NULL){
        $this->trackID = $trackID;
        $this->date_played = $date_played;
        $this->ID = $ID;
    }

    public static function insertRecord($database, $record){
        $query = "INSERT INTO history (trackID, date_played) VALUES (?, ?)";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;   
        }
        mysqli_stmt_bind_param($stmt, "is", $record->trackID, date_format($record->date_played,Config::$mysqlDatetimeFormat));
        if(mysqli_stmt_execute($stmt)){
            return mysqli_insert_id($database->conn);
        }
        return false;
    }

    public static function returnPreviousTrack($database){
        $query = "SELECT * FROM history ORDER BY ID DESC LIMIT 1";
        $stmt = mysqli_stmt_init($database->conn);
        if(!mysqli_stmt_prepare($stmt, $query)){
            return NULL;
        }
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
	    return $previousTrack = new History($row["trackID"], $row["date_played"], $row["ID"]);
    }
}