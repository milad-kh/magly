<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$postID = $_GET['postID'];
$post = get_post($postID);

$pattern1='/\[caption.*\"\]/i';
$pattern2='/\[\/caption*\]/i';
$pattern4='/^[^\.]*/i';

$post_thumbnail_id = get_post_thumbnail_id($post->ID);
$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
$catId = get_the_category($post->ID);

// fetch like of post
$str = 'select * from wp_postmeta where post_id ='.$post->ID.'&& meta_key = _zila_like ';
$likes = $wpdb->get_results($str);
$post->catId = $catId;
$post->thumbnail = $thumb_url[0];
$args = array ('post_id' => $post->ID);
$post->comments = get_comments($args);
$post->likes = $likes;

$post->post_content = preg_replace($pattern1,'',$post->post_content);
$post->post_content = preg_replace($pattern2,'',$post->post_content);
$post->summary = strip_tags($post->post_content);	
preg_match( $pattern4, $post->summary, $match );
$post->summary = $match;
if (in_array($post->ID, $listOfPostsID))
  $post->isFavorite= true;
else
  $post->isFavorite= false;
echo json_encode ($post);