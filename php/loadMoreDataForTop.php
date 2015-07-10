<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
require_once("../wp-load.php");
$biggestIDinLocal= $_GET['biggestIDinLocal'];
$number_to_get_post = $_GET['numberToGetPost'];
// fetch lastest posts ID
$args = array(
	'posts_per_page'   => $number_to_get_post,
	'offset'           => 0,
	'category'         => '',
	'category_name'    => '',
	'orderby'          => 'post_date',
	'order'            => 'DESC',
	'include'          => '',
	'exclude'          => '',
	'meta_key'         => '',
	'meta_value'       => '',
	'post_type'        => 'post',
	'post_mime_type'   => '',
	'post_parent'      => '',
	'post_status'      => 'publish',
	'suppress_filters' => true 
);

$most_recent_post = get_posts($args);
$pattern4='/^[^\.]*/i';
$guidPattern = '/http:\/\/magly.ir\/\?p=\d+/i';
for ($i=($biggestIDinLocal + 1);$i < $most_recent_post[0]->ID;$i++)
{  
  $currentPost = get_post($i);
  if ($currentPost->post_status == 'publish' && $currentPost->menu_order == 0 && preg_match($guidPattern, $currentPost->guid))
  {
    if ($k < $number_to_get_post)
     {
       $posts_array[] = $currentPost;  
       $k++;
     }  
  }
}
// add thumbnail to posts
for($i = 0;$i < count($posts_array);$i++)
{	
	$post_thumbnail_id = get_post_thumbnail_id($posts_array[$i]->ID);	
	$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	$catId=get_the_category($posts_array[$i]->ID);
	$posts_array[$i]->catId = $catId;
	$posts_array[$i]->thumbnail = $thumb_url[0];
	
	$posts_array[$i]->summary = strip_tags($posts_array[$i]->post_content);
	preg_match( $pattern4, $posts_array[$i]->summary, $match );
	$posts_array[$i]->summary = $match;
	$posts_array[$i]->isLike = false;
};
echo json_encode($posts_array);