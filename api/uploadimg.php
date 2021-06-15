<?php //pure fucking cancer
require_once '../requestUtils.php';
$data = json_decode(file_get_contents("php://input"));
$filename = "../album_art/".$_FILES["trackImg"]["name"];
$width = 200;
$height = 200;
if(move_uploaded_file($_FILES["trackImg"]["tmp_name"], $filename)){
    //retarded resizing
    list($width_orig, $height_orig) = getimagesize($filename);
    //yes, this retarded shit is necessary
    $ratio_orig = $width_orig/$height_orig;
    if ($width/$height > $ratio_orig) {
    $width = $height*$ratio_orig;
    } else {
    $height = $width/$ratio_orig;
    }
    // retarded other shit, nobody actually knows what this shit does
    $image_p = imagecreatetruecolor($width, $height);
    $image = imagecreatefromjpeg($filename);
    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig); //this terribleness changes $image_p btw
    // imagejpeg = save the file, obviously
    imagejpeg($image_p, "../album_art_thumbnail/".$_FILES["trackImg"]["name"], 100);
    RequestUtils::returnData("success", true); 
} else {
    RequestUtils::returnFail();
} 