<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;    
$username = rawurldecode($_GET['username']);
$password = rawurldecode($_GET['password']);
$user = $wpdb->get_results("SELECT * FROM wp_users where user_login = '$username'");  
if(wp_check_password($password, $user[0]->user_pass)) {
    echo json_encode(array("status"=>"ok","info"=>$user[0]));
}
else
{
    echo json_encode(array("status"=>"no"));
}