<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
require_once("../wp-load.php");
$args = array(
	'type'                     => 'post',
	'child_of'                 => 0,
	'parent'                   => '0',
	'orderby'                  => 'name',
	'order'                    => 'ASC',
	'hide_empty'               => 1,
	'hierarchical'             => 1,
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
  //print_r ($value);
}
echo (json_encode($categories));