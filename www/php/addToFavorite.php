<?php
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
//header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$userID = $_GET['userID'];
$postID = $_GET['postID'];

$metaValue = 'a:1:{i:0;s:4:"'.$postID.'";}';
echo $metaValue;

$data = array (
  'user_id' => $userID,
  'meta_key' => 'wpfp_favorites',
  'meta_value' => $metaValue
);
//print_r ($data);
$res = $wpdb->insert('wp_usermeta', $data);
echo $res;