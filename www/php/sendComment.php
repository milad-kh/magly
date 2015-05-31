<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$postID= $_GET['postID'];
$name = $_GET['name'];
$email = $_GET['email'];
$url = $_GET['url'];
$comment = $_GET['comment'];
$arr = array(
	"comment_author"=>$name,
	"comment_author_email"=>$email,
	"comment_author_url"=>$url,
	"comment_post_ID"=>$postID,
	"comment_content"=>$comment
	);
$x = $wpdb->insert('wp_comments',$arr);

$comment_info = $wpdb->get_results("SELECT DISTINCT * FROM wp_comments WHERE comment_post_ID = $postID");
	
echo json_encode($comment_info);
?>