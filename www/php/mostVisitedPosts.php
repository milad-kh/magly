<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");

function popularPosts($num) {
    global $wpdb;
    
    $posts = $wpdb->get_results("SELECT ID, comment_count, post_title FROM $wpdb->posts ORDER BY comment_count DESC LIMIT 0 , $num");        
    return json_encode ($posts);
}
echo popularPosts(5);