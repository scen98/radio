<?php
require_once 'config.php';
require_once 'DBINFO.php';
require_once 'requestUtils.php';
require_once 'history.php';
require_once 'track.php';
require_once 'queuelist.php';

RequestUtils::checkMethod($_SERVER['REQUEST_METHOD']);
RequestUtils::checkTrackType(RequestUtils::postvar('tracktype', -1));

if(RequestUtils::postvar('xpwd') == Config::$XPWD) {
	$database = new Database;
	$date = RequestUtils::objectifyDateTime(RequestUtils::postvar('date') . ' ' . RequestUtils::postvar('time'), 'post');
	$receivedPost = new Track(RequestUtils::postvar('trackid'), RequestUtils::postvar('artist'), RequestUtils::postvar('title'), $date);
	$previousTrack = History::returnPreviousTrack($database);
	$processedPost = Track::processPost($receivedPost, $previousTrack, RequestUtils::postvar('tracktype'));
	if($processedPost){
		if(Track::updateTrack($database, $processedPost)){
			echo Config::$trackUpdateSuccess;
		}else{
			echo Config::$trackUpdateFail;
		}
		$historyRecord = new History($processedPost->trackID, $processedPost->date_added);
		if(History::insertRecord($database, $historyRecord)){
			echo Config::$historyUpdateSuccess;
		}else{
			echo Config::$historyUpdateFail;
		}
	}else{
		echo Config::$invalidRequest;
	}
	$remoteDatabase = new remoteDatabase;
	if(!$remoteDatabase->conn) {
		$defaultDate = RequestUtils::objectifyDateTime(Config::$defaultTime, 'time');
		$nextTrack = new Track(Config::$defaultID, Config::$stationName, Config::$databaseErrorTitle, $defaultDate);
		Track::updateNextTrack($database, $nextTrack);
		exit();
	}
	$queuelist = Queuelist::returnQueuelist($remoteDatabase);
	$nextTrack = Queuelist::processQueuelist($remoteDatabase, $queuelist);
	Track::updateNextTrack($database, $nextTrack);
}else{
	echo Config::$wrongPW;
}