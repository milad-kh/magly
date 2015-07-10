<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$newPassword = rawurldecode($_GET['newPassword']);
$userID = $_GET['userID'];
$password= wp_hash_password($newPassword);
$wpdb->update('wp_users', array(user_pass=>$password), array(ID=>$userID));
