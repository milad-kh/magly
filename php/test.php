<?php
$guidPattern = '/\"http:\/\/magly.ir\/\?p=\d+\"/i';
$guid = '"http://magly.ir/?p=2345"';

if (preg_match($guidPattern,$guid))
  echo 'ok';
else
  echo 'not ok';