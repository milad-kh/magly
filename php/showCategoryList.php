<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
//header('Content-Type: text/html; charset=utf-8');
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
$cat = new stdClass();
$cat->term_id='all';
$cat->name='همه مقالات';
$cat->cat_ID='all';
array_unshift($categories,$cat);
foreach($categories as $key=>$value)
{
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
  switch ($value->cat_ID) {    
    case '41':
        $value->description = 'راه های افزایش امید و انگیزش در زندگی و کار';
        break;
    case '47':
        $value->description = 'آیا می دانید بهترین راه های سپری کردن اوقات فراغت چیست';
        break;  
    case '28':
        $value->description = 'افزایش انگیزه و راندمان کاری و منع آفت روانی';
        break;
    case '1504':
        $value->description = 'تجملات مد فشن و زندگی با ابزار مدرن';
        break;
    case '44':
        $value->description = 'اگر به دنبال اطلاعاتی در مورد تناسب اندام احتیاج دارید این قسمت را از دست ندهید';
        break;
    case '29':
        $value->description = 'آخرین اخبار تکنولوژی و گجت های روز';
        break;
    case '43':
        $value->description = 'هر آنچه در مورد مدیریت خانواده احتیاج دارید';
        break;
    case '75':
        $value->description = 'تکنیک هایی جهت چیدمان جذاب تر محیط خانه و کار';
        break; 
    case '42':
        $value->description = 'بهبود روابط کاری اجتماعی را در این قسمت بخوانید';
        break; 
    case '26':
        $value->description = 'مقالاتی جهت تغییر و بهبود سبک زندگی مان';
        break; 
    case '46':
        $value->description = 'دستورالعمل هایی جهت افزایش ایمنی بدن وسلامتی';
        break; 
    case '45':
        $value->description = 'فواید انواع مختلف رژیم های غذایی و نوشیدنی های مختلف';
        break;
    case '292':
        $value->description = 'چگونه شرکت و زیر دستانمان را به بهترین شکل راهبری کنیم';
        break;
    case '27':
        $value->description = 'هر آنچه در مورد پول لازم است بدانید';
        break;
    case '30':
        $value->description = 'هر آنچه لازم است در مورد کارتان وحواشی آن بدانید';
        break;
    case '1':
        $value->description = 'روش های کارآفرینی را اینجا بیاموزید';
        break;   
    case '1503':
        $value->description = 'اطلاعاتی جذاب در مورد نقاط دیدنی دنیا';
        break;
    case '5598':
        $value->description = 'مقالات جذابی که به نظر ما ارزش خواندن دارند';
        break;
    default:
        $value->description = 'لیست تمامی مقالات به ترتیب جدیدترین ها';
  }
}
echo (json_encode($categories));