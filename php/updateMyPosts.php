<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once("../wp-load.php");
$startPostID=$_GET['startPostID'];
// fetch last post ID
$args = array(
	'posts_per_page'   => 1,
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
$posts_array = get_posts($args);
$endPostID=$posts_array[0]->ID;
// end of calculate last post ID
$postList=array();
for ($i=($startPostID +1) ;$i<=$endPostID;$i++)
{
	$currentPost=get_post($i);
	$postList[]=$currentPost;
}
for($j = 0;$j < count ($postList) ; $j++)
{
	$post_thumbnail_id = get_post_thumbnail_id($posts_array[$j]->ID);
	$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	$catId=get_the_category($posts_array[$i]->ID);
	$posts_array[$i]->catId = $catId;
	$posts_array[$i]->thumbnail = $thumb_url[0];
	
}
echo json_encode($postList);