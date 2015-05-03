<?php
header("Access-Control-Allow-Origin: *");
$postID = $_GET['PostID'];
$email = $_GET['email'];
if (mail($email,"این پست رو بخون دوست عزیزم",$postID))
	echo('sent');