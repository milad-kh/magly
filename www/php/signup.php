<?php
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header('Content-Type: application/json');
require_once("../wp-load.php");
global $wpdb;
$username = 'a@gmail.com';
$password = '123';
$data = array (
  'user_email' => $username,
  'user_pass' => $password
);
$wpdb->insert('wp_users', $data);