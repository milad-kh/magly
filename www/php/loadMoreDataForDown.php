<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
require_once("../wp-load.php");
$smallestIDinLocal= $_GET['smallestIDinLocal'];
$number_to_get_post = 5;
$k = 0;
for ($i=($smallestIDinLocal-1);$i>0;$i--)
{  
    $currentPost = get_post($i);
    if ($currentPost->post_status == 'publish') 
    {
      if ($k < $number_to_get_post)
      {
        $posts_array[] = $currentPost;  
        $k++;
      }
     if ($k >= $number_to_get_post) 
     {
       break 1;
     }
    }
 }
//print_r($posts_array);
// add thumbnail to posts
for($i = 0;$i < count($posts_array);$i++)
{ 
  $post_thumbnail_id = get_post_thumbnail_id($posts_array[$i]->ID); 
  $thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
  $catId=get_the_category($posts_array[$i]->ID);
  $posts_array[$i]->catId = $catId;
  $posts_array[$i]->thumbnail = $thumb_url[0];
};
echo json_encode($posts_array);