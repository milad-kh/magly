<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
//require_once("../wp-config.php");

global $wpdb;    
//global $wp_hasher;
$username = rawurldecode($_GET['username']);
$password = rawurldecode($_GET['password']);
echo $password;
//$user = $wpdb->get_results("SELECT * FROM wp_users where user_email = '$username'");  
/*echo "<pre>";
print_r($user[0]);
echo "</pre>";*/
$password_hashed = '$P$BKstqSwNA7qWvUqqGJgDhe2m5Yjp3Z1';
$plain_password = 'miladKHAN!@#$%^';
/*if(wp_check_password($password, $password_hashed)) {
    echo json_encode("ok");
}
else
{
    echo json_encode("No");
}

/*if (size($user) > 0)
  $result = array(
    "status"=>"success"
  );
else
  $result = array(
    "status"=>"fail"
  );
echo json_encode ($result);*/