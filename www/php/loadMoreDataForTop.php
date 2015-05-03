<?php
header("Access-Control-Allow-Origin: *");
//header('Content-Type: application/json');
require_once("../wp-load.php");

$biggestIDinLocal= $_GET['biggestIDinLocal'];
$number_to_get_post = 10;
// fetch lastest posts ID
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

$most_recent_post = get_posts($args);
/*
print_r($biggestIDinLocal);
print_r($most_recent_post[0]->ID);
$currentPost = get_post(4679);
print_r($currentPost);
*/

for ($i=$biggestIDinLocal;$i < $most_recent_post[0]->[ID];$i++)
{
  
  echo ($i);
  /*$currentPost = get_post($i);
  print_r($currentPost);*/
  /*if ($currentPost[post_status] == 'publish ')
  {
  	$posts_array[] = $currentPost;  
  }*/
}
//echo json_encode($posts_array);