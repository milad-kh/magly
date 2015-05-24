<?php
header("Access-Control-Allow-Origin: *");
//header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
require_once("../wp-load.php");
$postID = $_GET['postID'];
$to = $_GET['email'];
$currentPost = get_post($postID);
// echo ("<pre>");
// print_r($currentPost);
// echo ("</pre>");
		$subject = $currentPost->post_title;       
		// متن و مدهای اصلی نامه ی ایمیل به کاربر که به صورت اچ تی ام ال ارسال میشه
		$message = "
		<meta charset='utf-8'>
<body>
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='border-collapse:collapse;font: 12px tahoma,Helvetica ,arial, sans-serif;direction: rtl'>
	<tbody>
	<tr>
		<td align=center bgcolor='#fff'>
			<table  width='600' cellpadding='0' cellspacing='0' border='0'>
				<tbody>
					<tr>
						<td>
							<table cellpadding='0' cellspacing='0' border='0'>
								<tr>
									<td colspan='2' align='center'>
										<div style='height: 94px'>
											<a href='http://www.magly.ir/' target='_blank' style='display: block'>
												<img src='http://www.summits.ir/email/myEmail1.jpg' alt='انتشارات سامیت'>
											</a>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td align='center' bgcolor='#fff'>
			<table  width=600 cellpadding='0' cellspacing='0' style='color: #fff;background-color: #2fc0fc;border-radius: 0 0 10px 10px'>
				<tbody>
				<tr>
					<td colspan='2' >
						<table  width='600' cellpadding='20' cellspacing='0' border='0'>
							<tbody>
							<tr>
								<td>
									<table cellpadding='20' cellspacing='0' border='0' style='width: 100%;border: 1px solid #fff;border-radius: 5px;margin-top: 20px;color: #fff'>
										<tr>
											<td colspan='2' style='padding: 0'>
												<div style='background-color: #fff;border-radius: 5px;font-size: 18px;margin: -15px 20px 0 0;padding:5px 10px;font-family: arial;text-align: center;color: #0067AC'>
													<a href='".$currentPost->guid."'>".$currentPost->post_title."</a>
												</div>
											</td>
										</tr>
										<tr>
											<td colspan='2' align='right'>
												<table cellpadding='20' cellspacing='0' border='0' style='background-color: #fff;border-radius: 10px;width: 100%;text-align: right'>
													<tr>
														<td colspan='2' align='right' style='font-size: 12px;color: #0067AC;line-height: 20px'>
															<div>
																
															</div>
															<div>
																
															</div>
															<div>
																
															</div>
														</td>
													</tr>
													<tr>
														<td style='padding: 0 20px;'>
															<div style='height: 1px;background-color: #e5e5e5'>

															</div>
														</td>
													</tr>
													<tr>
														<td colspan='2' align='right' style='font-size: 12px;color: #0067AC;line-height: 20px'>
															<div>
															</div>
															<div>
															</div>
															<div>
															</div>
															<div>
															</div>
															<div>
															</div>
															<div>
															</div>
														</td>
													</tr>
													<tr>
														<td style='padding: 0 20px;'>
															<div style='height: 1px;background-color: #e5e5e5'>

															</div>
														</td>
													</tr>
													<tr>
														<td colspan='2' align='right' style='font-size: 12px;color: #0067AC;line-height: 20px'>
															<div>
																کاربر گرامی این لینک از طرف یکی از دوستان شما برایتان ارسال شده است. ایشان این محتوا را بری شما مناسب تشخیص داده اند. در صورتی که نمیخواهید مجددا این محتوا را دریافت کنید روی لینک زیر کلیک کنید
															</div>
														</td>
													</tr>
												</table>
											</td>
										</tr>
										<tr>
											<td style='font-size: 13px;line-height: 22px;padding-top: 0'>
												<div>
													موفق باشید
												</div>
												<div>
													تیم Magly
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>

					<td colspan='2' height='60' align='center' style='font-size: 13px'>
						<div>
							<div>
								وبسایت مگلی تولید کننده ی محتوای غنی فارسی
							</div>
							<div>
								<a style='color: #0067AC' href='http://www.magly.ir/' target='_blank'>www.magly.ir</a>
							</div>
						</div>
					</td>
				</tr>


				</tbody>
			</table>
		</td>
	</tr>
	</tbody>
</table>
</body>
		";      
		//
		// Always set content-type when sending HTML email
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		
		// More headers
		$headers .= 'From: <article@magly.ir>' . "\r\n";        
		mail($to,$subject,$message,$headers);

/*if (mail($email,"این پست رو بخون دوست عزیزم",$postID))
	echo('sent');*/