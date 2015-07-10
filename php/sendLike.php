<?php
header("Access-Control-Allow-Origin: *");
require_once("../wp-load.php");
global $wpdb;
$postID = $_GET['postID'];
$str = "select * from wp_postmeta where post_id =$postID and meta_key='_zilla_likes' ;";
$likes = $wpdb->get_results($str);
if(empty($likes))
{
  $arr = array (
    "post_id" =>$postID,
    "meta_key" => '_zilla_likes',
    "meta_value" => 1
  );
  $wpdb->insert('wp_postmeta',$arr);
}
else
{
  $oldValue = $likes[0]->meta_value;
  $oldValue ++;
  $res = $wpdb->update('wp_postmeta', array("meta_value"=>$oldValue), array("post_id"=>$postID,"meta_key"=>'_zilla_likes') );
}