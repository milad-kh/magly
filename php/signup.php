<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$fullName= $_GET['fullName'];
$niceName= $_GET['niceName'];
$email= $_GET['email'];

$f = $wpdb->get_results("SELECT * FROM wp_users where user_email = '$email'");
if(count($f) == 0)
{
  $password= wp_hash_password(rawurldecode($_GET['password']));
  $data = array (
    'display_name' => $fullName,
    'user_email' => $email,
    'user_pass' => $password,
    'user_login' => $niceName
  );
  $wpdb->insert('wp_users', $data);
  $user = $wpdb->get_results("SELECT * FROM wp_users where user_email = '$email'");
  $status[0] = $user;
  $status[1] = 'ok';
}
else
{
  $status[0] = null;
  $status[1] = 'repeat';
}
echo json_encode($status);