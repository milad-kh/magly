<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
$args = array(
	'type'                     => 'post',
	'child_of'                 => '',
	'parent'                   => '',
	'orderby'                  => 'name',
	'order'                    => 'ASC',
	'hide_empty'               => 1,
	'hierarchical'             => '',
	'exclude'                  => '',
	'include'                  => '',
	'number'                   => '',
	'taxonomy'                 => 'category',
	'pad_counts'               => false 
); 
$categories = get_categories($args);
foreach($categories as $key=>$value)
{
  $classNumber ++;
  $value->classNumber = $classNumber;
  $args = array(
	'posts_per_page'   => 1,
	'offset'           => 0,
	'category'         => $value->cat_ID,
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

  $post = get_posts($args);
  $post_thumbnail_id = get_post_thumbnail_id($post[0]->ID);
  $thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
  $value->thumbnail=$thumb_url[0];
  $value->post=$post;
}
$kol[0] = $categories;
// get last post
$args = array(
	'posts_per_page'   => 1,
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

  $post = get_posts($args);
  $post_thumbnail_id = get_post_thumbnail_id($post[0]->ID);
  $thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
//
$kol[1] = $thumb_url[0];
echo (json_encode($kol));