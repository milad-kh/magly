<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$catID = $_GET['catID'];
if ($catID == 0)
  $catID = '';
$args = array(
	'posts_per_page'   => 50,
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
$randomIndex = rand(1,50);
$post_thumbnail_id = get_post_thumbnail_id($posts_array[$randomIndex]->ID);
$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	
echo json_encode($thumb_url);