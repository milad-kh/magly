<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
require_once("../wp-load.php");
$biggestIDinLocal= $_GET['biggestIDinLocal'];
$userID = $_GET['userID'];
$number_to_get_post = $_GET['numberToGetPost'];
$category = $_GET['category'];
$pattern4='/^[^\.]*/i';
$guidPattern = '/http:\/\/magly.ir\/\?p=\d+/i';

if ($category == 'posts')
  $catID = '';
else
  $catID = $category;

for($i=($biggestIDinLocal+1);$i<8500;$i++)
{ 
$currentPost = get_post($i);
$catId=get_the_category($currentPost->ID);
$currentPost->catId = $catId;
$categoryArray = '';
foreach ($currentPost->catId as $key=>$val)
{
  $categoryArray[]=$val->term_id;
}
if($catID == '')
  $categoryArray[] ='';
if ($currentPost->post_status == 'publish' && $currentPost->menu_order == 0 && preg_match($guidPattern, $currentPost->guid)) 
    {
        if ($k < $number_to_get_post && in_array($catID,$categoryArray))
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
// add thumbnail to posts
for($i = 0;$i < count($posts_array);$i++)
{	
	$post_thumbnail_id = get_post_thumbnail_id($posts_array[$i]->ID);	
	$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	
	$posts_array[$i]->thumbnail = $thumb_url[0];
	
	$posts_array[$i]->summary = strip_tags($posts_array[$i]->post_content);
	preg_match( $pattern4, $posts_array[$i]->summary, $match );
	$posts_array[$i]->summary = $match;
	$posts_array[$i]->isLike = false;
};
echo json_encode($posts_array);