<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$catID = $_GET['catID'];
//echo $catID;
$oldImage = $_GET['oldImage'];
if ($catID == 0)
  $catID = '';

function image_Generator()
{
  $args = array(
	'posts_per_page'   => 15,
	'offset'           => 0,
	'category'         => '',
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
$randomIndex = mt_rand(1,15);
$post_thumbnail_id = get_post_thumbnail_id($posts_array[$randomIndex]->ID);
$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
return $thumb_url;
}

while(true)
{
  $newImage = image_Generator();
  if($oldImage != $newImage[0] && $newImage[0]!='http://magly.ir/wp-includes/images/media/default.png')
  {
    echo json_encode($newImage);
    break 1;
  }
}