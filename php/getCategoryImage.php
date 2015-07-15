<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$catID = $_GET['catID'];
$oldImage = $_GET['oldImage'];
if ($catID == 0)
  $catID = '';

function image_Generator()
{
  $args = array(
	'posts_per_page'   => 10,
	'offset'           => 0,
	'category'         => $catID,
	'category_name'    => '',
	'orderby'          => 'ID',
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
$randomIndex = mt_rand(1,10);
$post_thumbnail_id = get_post_thumbnail_id($posts_array[$randomIndex]->ID);
$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
return $thumb_url[0];
}

while(true)
{
  $newImage = image_Generator();
  if($oldImage != $newImage)
    break 1;
}

echo json_encode($newImage);