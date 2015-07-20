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

$str = 'select * from wp_usermeta where user_id ='.$userID.' AND meta_key = "wpfp_favorites"';
$rawlist = $wpdb->get_results($str);
if (count($rawlist) == 0)
{
  $metaValue = 'a:1:{i:0;s:4:"'.$postID.'";}';
  $data = array (
    'user_id' => $userID,
    'meta_key' => 'wpfp_favorites',
    'meta_value' => $metaValue
  );
  $res = $wpdb->insert('wp_usermeta', $data);
}
else
{
  $tempData = explode(";",$rawlist[0]->meta_value);  
  for ($i=0;$i<count($tempData);$i++)
  {
    if(preg_match("/s:4:\"\d{1,}\"/i", $tempData[$i]))
    {
      $temp = explode("s:4:", $tempData[$i]);
      $listOfPostsID[] = str_replace('"', '', $temp[1]);    
    }
  }
  
  $listOfPostsID = array_unique($listOfPostsID);  
  $key = array_search($postID, $listOfPostsID);    
  if($key===false)
  {   
    $listOfPostsID[] = $postID;
    $listOfPostsID = array_values($listOfPostsID);
  }         
  else
  {   
    unset($listOfPostsID[$key]);
    $listOfPostsID = array_values($listOfPostsID);
  }  
  // re-make final array and save in database
  
  $part1 = 'a:'.count($listOfPostsID).':{';  
  for ($j=0;$j<count($listOfPostsID);$j++)
  {
    $part2 .= 'i:'.$j.';s:4:"'.$listOfPostsID[$j].'";';
  }
  $part3 = '}';
  $finalString = $part1.$part2.$part3;
  $wpdb->update('wp_usermeta', array(meta_value=>$finalString), array(user_id=>$userID));
  if (count($listOfPostsID) == 0)
    $wpdb->delete('wp_usermeta', array(user_id=>$userID));
}

$data = array("result"=>"ok");
echo json_encode($data);