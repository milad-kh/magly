<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;    
$username = $_GET['username'];
$password = $_GET['password'];
$user = $wpdb->get_results("SELECT * FROM $wpdb->users where user_email = $username && user_pass == $password");        
if (size($user) == 1)
  echo 'login successfully';
else
  echo 'login failed';   
//echo json_encode ($posts);
