<?php
require_once 'config.php';
class RequestUtils {
    public static function checkLimit($limit){
        if(empty($limit)){
            RequestUtils::returnFail('Use limit=x with this request!');
        }else if(!is_numeric($limit)){
            RequestUtils::returnFail('Limit must be a number!');
        }else if($limit > 5000){
            RequestUtils::returnFail('Maximum limit is 5000!');
        }
    }
    public static function checkID($trackID){
        if(empty($trackID)){
            RequestUtils::returnFail('Use trackid=x with this request!');
        }else if(!is_numeric($trackID)){
            RequestUtils::returnFail('trackID must be a number!');
        }
    }
    public static function checkTrackType($tracktype){
        if (!empty(Config::$allowedTrackTypes) && !in_array($tracktype, Config::$allowedTrackTypes)) {
            exit('Track type ' . $tracktype . ' not allowed');
        }
    }
    public static function checkData($data){
        if(empty($data)){
            http_response_code(400);
            echo json_encode(["response"=> "Use term=? with this request!"]);
            exit();
        }
    }
    public static function returnData($name, $data){
        http_response_code(200);
        echo json_encode([$name => $data]);
        exit();
    }
    public static function postvar($var, $default = null) {
        return isset($_POST[$var]) ? $_POST[$var] : $default;
    }
    public static function returnFail($message = null){
        if(!$message){
            $message = 500;
        }
        http_response_code(500);
        echo json_encode(["response" => $message]);
        exit();
    }
    public static function checkMethod($method){
        if($method != 'POST'){
            header('Method Not Allowed', 405, true); 
            http_response_code(405);
	        exit('This script accepts only POST requests!');
        }
    }
    public static function objectifyDateTime($rawDateTime, $format){
        switch($format){
            case 'post':
                return $dateObject = date_create_from_format(Config::$postDateFormat . ' ' . Config::$postTimeFormat, $rawDateTime);
            break;
            case 'mysql':
                return $dateObject = date_create_from_format(Config::$mysqlDatetimeFormat, $rawDateTime);
            break;
            case 'date':
                return $dateObject = date_create_from_format(Config::$streamDateFormat, $rawDateTime);
            break;
            case 'time':
                return $dateObject = date_create_from_format(Config::$streamTimeFormat, $rawDateTime);
            break;
            default:
            return false;
        }
    }
}