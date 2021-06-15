<?php
/*
Put this in RadioDJ Now Playing Plugin:
xpwd=sphag&trackid=$track_id$&tracktype=$track-type$&artist=$artist_enc$&title=$title_enc$&date=$now-shortdate$&time=$now-longtime$
$now-longtime$ : 1:08:09 PM -> No leading zero on the hour (Format: "g:i:s A")
$now-shorttime$ : 1:09 PM -> No leading zero on the hour (Format: "g:i A")
$now-shortdate$ : 3/1/1998 -> M(M)/D(D)/YYYY -> No leading zeros day & month! (Format: "n/j/Y")
$now-longdate$ : Tuesday, November 17, 2020
https://www.w3schools.com/php/func_date_date_format.asp

IMPORTANT! After installing webpage on a new server, (if nexttrack table is empty) initialization of the nexttrack table is necessary
by uncommenting a line in the updateNextTrack method in track.php! Without this, the nexttrack element will not work!

Post Variables:
xpwd
trackid
tracktype
artist
title
date
time
*/
date_default_timezone_set('Europe/Budapest');
class Config{

    public static $XPWD = 'sphag';                                      // The 'xpwd' attribute sent out by RadioDJ Now Playing plugin.
    public static $wrongPW = 'Wrong Password.';                         // Reply if the password above is incorrect.
    public static $trackUpdateSuccess = 'Track data successfully updated, and ';            // Message if track update was successful.
    public static $trackUpdateFail = 'Something went wrong with updating track data, and '; // Message if track update failed.
    public static $historyUpdateSuccess = 'history was successfully saved.';                // Message if history update was successful.
    public static $historyUpdateFail = 'something went wrong with saving to database.';     // Message if history update failed.
    public static $invalidRequest = 'Sent information was empty, invalid, or duplicate.';   // Message if request is invalid, duplicate or empty.

    public static $postDateFormat = 'n/j/Y';                            // Date format of POST variable 'date'. See help above.
    public static $postTimeFormat = 'g:i:s A';                          // Time format of POST variable 'time'. See help above.
    public static $mysqlDatetimeFormat = 'Y-m-d H:i:s';                 // Datetime format found in the mysql database. See help above.
    public static $streamDateFormat = 'Y.m.d';                          // Date format used in the stream. See help above.
    public static $streamTimeFormat = 'H:i:s';                          // Time format used in the stream. See help above.

    public static $stationName = 'Radio 1';                             // The artist to be used during "Commercial", or in case of invalid, empty or duplicate requests
    public static $stationSlogan = 'Csak Igazi Mai Slager Megy';        // The title equivalent of the previous
    public static $defaultStreamTitle = 'Listening Live';               // Default title for "Internet Stream" track types out of the time frames
    public static $defaultTime = '00:00:00';                            // Used as time in case of database errors, or if has no suitable tracks for nexttrack
    public static $databaseErrorTitle = 'No Connection To Database';    // Used as title in case of database errors
    public static $defaultID = 1;                                       // trackID for "Commercial", missing, invalid or any other song
    public static $defaultStreamID = 2;                                 // Default ID for "Internet Stream" track types out of the time frames

    public static $allowedTrackTypes = array(   // These track types will be accepted into processing
        0, // Music
    //	1, // Jingle
    //	2, // Sweeper
    //	3, // Voiceover
        4, // Commercial
        5, // Internet Stream
        6, // Other
    //	7, // VDF (Variable Duration File)
        8, // Podcast
    //	9, // Request ???
        10, // News
    //	11, // Playlist Event
    //	12, // FileByDate
    //	13, // NewestFromFolder
    //	14, // Teaser
    );
    public static $allowedNextTrackTypes = array(0, 5, 6, 8, 10);   // Thease track types will be accepted as next track

    public static $otherTypeTitleOne = 'Esti Mix';              // The title of "Other" track types, option one
    public static $otherTypeIDOne = 3;                          // The trackID of "Other" track types, option one
    public static $otherTypeTitleTwo = 'Classic Mix';           // The title of "Other" track types, option two
    public static $otherTypeIDTwo = 4;                          // The trackID of "Other" track types, option two
    public static $otherTypeOneArray = array(1, 2, 3, 4, 5, 6); // This array specifies the days on which option NUMBER ONE is displayed. 0 is Sunday, 6 is Saturday

    public static $firstTimeWindowLOWER = '16:45:00';       // Variables used to set up time windows in which any "Internet Stream" type track
    public static $firstTimeWindowUPPER = '18:00:00';       // will be displayed according to parameters set below. The first window supports
    public static $secondTimeWindowLOWER = '20:45:00';      // 2 cover and title variations throughout the week, the second one supports unique 
    public static $secondTimeWindowUPPER = '23:59:59';      // covers and the same title for every weekday. Format = HH:MM:SS

    public static $firstTimeWindowTitleOne = 'Live Mix';               // Specifies title option one for the first time window
    public static $firstTimeWindowIDOne = 5;                           // trackID for option one for the first time window
    public static $firstTimeWindowTitleTwo = 'Cooky Weekend Show';     // Specifies title option two for the first time window
    public static $firstTimeWindowIDTwo = 6;                           // trackID for option two for the first time window
    public static $firstTimeWindowArray = array(1, 2, 3, 4, 5);        // This array specifies the days on which option NUMBER ONE is displayed. 0 is Sunday, 6 is Saturday

    public static $secondTimeWindowTitle = 'World Is Mine Radio Show';      // Title of the "Internet Stream" in the second time window.
    public static $secondTimeWindowID = 7;                                  // CAUTION! This number is added to the weekday to get the ID. 0 for Sunday, 6 for Saturday
}