<?php
header("Access-Control-Allow-Origin: *");
//header('Content-Type: application/json');
header('Content-Type: text/html; charset=utf-8');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
require_once("../wp-load.php");
$postID = $_GET['postID'];
$to = $_GET['email'];
$currentPost = get_post($postID);
$post_thumbnail_id = get_post_thumbnail_id($postID);
$thumb_url = wp_get_attachment_image_src($post_thumbnail_id,'small', true);

$currentPost->thumbnail=$thumb_url[0];
/*echo ("<pre>");
	print_r($currentPost);
echo ("</pre>");*/
$subject = $currentPost->post_title;       
// 
$message = "
		<meta charset='utf-8'>
<body style='direction:rtl'>
<div style='background: #eeeeee;width: 60%;margin:50px auto;outline: 1px solid gray;height: auto;padding-top:25px;'>
		<a href='http://www.magly.ir'>
			<div>
				<img src='http://www.magly.ir/HybridAppAPI/email-images/logo2.png' style='display:block;margin:25px  auto 0;'alt='' />
	 		</div>
			<div>
				<img src='http://www.magly.ir/HybridAppAPI/email-images/maglylogo.png' style='display:block;margin:5px auto 0;'alt='' />
			</div>
		</a>
		<!-- END HEADER -->
		<div >
		<a href='".$currentPost->guid."'>
			<div style='text-align: center;display: block;margin:15px auto 25px;width: 70%; '>
				<img src='".$currentPost->thumbnail."'  style='width:100%;height:auto;float:right;margin:5px auto 0;
' alt=''>
			</div>
			</a>
			<div  style='clear:both;'>
				<h1 style='font-family:B Yekan,B Nazanin,B Mitra,tahoma;font-size:22px;font-weight:normal;direction:rtl;padding: 25px 22px;'>
        ".$currentPost->post_title."  
        </h1>
			</div>
			<div>
				<p style='font-family:B Yekan,B Nazanin,B Mitra,tahoma;	direction: rtl;font-size: 18px;line-height: 40px;text-align: justify;padding: 20px 20px 60px 40px;'>
					".substr(strip_tags($currentPost->post_content),0,100)." ...				
				<span style='width: 150px;height: 30px;border:2px solid #323a45;float: left;font-size:17px;text-align:center;line-height:30px;margin-top: 10px;background:#ffffff;'>
					<a href='".$currentPost->guid."' style='text-decoration:none;color:#55acee;'>ادامه مطلب ...</a>
				</span>
			</p>
			</div>
			<div style='text-align: center;padding-bottom: 15px;'>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-facebook.png' alt=''></a>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-gplus.png' alt=''></a>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-rss.png' alt=''></a>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-twitter.png' alt=''></a>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-youtube.png' alt=''></a>
					<a href='#'><img src='http://www.magly.ir/HybridAppAPI/email-images/icon-instagram.png' alt=''></a>
			</div>
		</div>
	</div>

</body>
		";      
		
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		
		// More headers
		$headers .= 'From: <article@magly.ir>' . "\r\n";        
		mail($to,$subject,$message,$headers);

/*if (mail($email,"این پست رو بخون دوست عزیزم",$postID))
	echo('sent');*/