<?php
  //$json = file_get_contents("php://input"); 
  $json = $_POST;
  $file = fopen('js/orders.json','w+');
  fwrite($file, $json);
  fclose($file);
?>