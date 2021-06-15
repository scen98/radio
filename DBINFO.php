<?php

//Local Database
class Database {
    private $servername = "de12.fcomet.com";
    private $dBUserName = "szbencli_radiodj";
    private $dBPassword = "radiodj11";
    private $dBName = "szbencli_radio";

    public $conn;

    public function __construct() {
        $this->conn = NULL;
        $this->conn = new mysqli($this->servername, $this->dBUserName, $this->dBPassword, $this->dBName);
        $this->conn->set_charset("utf8mb4");
        if ($this->conn->connect_errno) {
            echo "Failed to connect to MySQL: " . $this->conn->connect_error;
            exit();
        }
    }
}

//Remote Database
class remoteDatabase {
    private $servername = "31.46.202.164";
    private $dBUserName = "nowplaying";
    private $dBPassword = "misianyja69";
    private $dBName = "radiodj2020";
    private $port = "3306";

    public $conn;

    public function __construct() {
        $this->conn = NULL;
        $this->conn = new mysqli($this->servername, $this->dBUserName, $this->dBPassword, $this->dBName, $this->port);
        $this->conn->set_charset("utf8mb4");
        if ($this->conn->connect_errno) {
            $this->conn->close();
            $this->conn = NULL;
        }
    }
}
