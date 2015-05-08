<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$postID = $_GET['postID'];
$str = 'select * from wp_postmeta where post_id ='.$postID.'&& meta_key = _zila_like ';
$likes = $wpdb->get_results($str);
$wpdb->update('wp_postmeta',$arr,array(post_id=>$postID,meta_key='_zila_like'));