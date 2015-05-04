<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once("../wp-load.php");
$biggestIDinLocal= $_GET['biggestIDinLocal'];
$number_to_get_post = 5;
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
for ($i=($biggestIDinLocal + 1);$i < $most_recent_post[0]->ID;$i++)
{  
  $currentPost = get_post($i);
  if ($currentPost->post_status == 'publish')
  {
    if ($k < $number_to_get_post)
     {
       $posts_array[] = $currentPost;  
       $k++;
     }  
  }
}
echo json_encode($posts_array);