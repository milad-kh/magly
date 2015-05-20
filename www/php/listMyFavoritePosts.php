<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
//header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$userID = $_GET['userID'];
$str = 'select * from wp_usermeta where user_id ='.$userID.' AND meta_key = "wpfp_favorites"';
$rawlist = $wpdb->get_results($str);
foreach ($rawlist as $item)
{
  $posts_array[] = get_post(substr($item->meta_value,14,4));
}
for($i = 0;$i < count($posts_array);$i++)
{
	$post_thumbnail_id = get_post_thumbnail_id($posts_array[$i]->ID);
	$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	$catId = get_the_category($posts_array[$i]->ID);
	
	// fetch like of post
	$str = 'select * from wp_postmeta where post_id ='.$posts_array[$i]->ID.'&& meta_key = _zila_like ';
	$likes = $wpdb->get_results($str);
	
	$posts_array[$i]->catId = $catId;
	$posts_array[$i]->thumbnail = $thumb_url[0];
	$args = array ('post_id' => $posts_array[$i]->ID);
	$posts_array[$i]->comments = get_comments($args);
	$posts_array[$i]->likes = $likes;
};
echo json_encode($posts_array);