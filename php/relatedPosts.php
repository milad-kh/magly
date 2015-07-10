<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$userID = $_GET['userID'];
$postID = $_GET['postID'];
$cats = wp_get_post_categories($postID);
$args = array(
	'posts_per_page'   => 11,
	'offset'           => 0,
	'category'         => $cats[0],
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

$posts_array_temp = get_posts($args);
foreach ($posts_array_temp as $key=>$val)
{
  if ($val->ID != $postID)
    $posts_array[]=$val;
}
$pattern1='/\[caption.*\"\]/i';
$pattern2='/\[\/caption*\]/i';
$pattern3='/<h2.*><strong>.*<\/strong><\/h2>/i';
$pattern4='/^[^\.]*/i';
// make a list of user favorite posts

$str = 'select * from wp_usermeta where user_id ='.$userID.' AND meta_key = "wpfp_favorites"';
$rawlist = $wpdb->get_results($str);
$tempData = explode(";",$rawlist[0]->meta_value);

for ($i=0;$i<count($tempData);$i++)
{

  if(preg_match("/s:4:\"\d{1,}\"/i", $tempData[$i]))
  {
    $temp = explode("s:4:", $tempData[$i]);
    $listOfPostsID[] = str_replace('"', '', $temp[1]);    
  }

}

//print_r($listOfPostsID);

//
for($i = 0;$i < count($posts_array);$i++)
{
	$post_thumbnail_id = get_post_thumbnail_id($posts_array[$i]->ID);
	$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);
	$catId = get_the_category($posts_array[$i]->ID);
	
	// fetch like of post
	$str = 'select * from wp_postmeta where post_id ='.$posts_array[$i]->ID.'&& meta_key = _zila_like ';
	$likes = $wpdb->get_results($str);
	
	$posts_array[$i]->catId = $catId;
	$posts_array[$i]->thumbnail = $thumb_url[0];
	$args = array ('post_id' => $posts_array[$i]->ID);
	$posts_array[$i]->comments = get_comments($args);
	$posts_array[$i]->likes = $likes;
	
	$posts_array[$i]->post_content = preg_replace($pattern1,'',$posts_array[$i]->post_content);
	$posts_array[$i]->post_content = preg_replace($pattern2,'',$posts_array[$i]->post_content);
	$posts_array[$i]->summary = strip_tags($posts_array[$i]->post_content);
	//$posts_array[$i]->summary = preg_replace($pattern3,'',$posts_array[$i]->post_content);
	preg_match( $pattern4, $posts_array[$i]->summary, $match );
	$posts_array[$i]->summary = $match;
	if (in_array($posts_array[$i]->ID, $listOfPostsID))
	  $posts_array[$i]->isFavorite= true;
	else
	  $posts_array[$i]->isFavorite= false;
};

echo json_encode ($posts_array);