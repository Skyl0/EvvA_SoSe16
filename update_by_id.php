<?php
$data = file_get_contents("php://input");
$decoded = json_decode($data);
$id = $decoded->id;

echo ('My Id: ' . $id . '<br/>');
echo ('with data: ' . $data );


$connect = mysqli_connect("localhost","root","","pizza") or die ('Could not connect: ' . mysql_error());

if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

//$data = mysqli_real_escape_string($data);
// SQL Injection auf $data prüfen?

$query = "UPDATE orders
SET theorder='$data' WHERE id= '" . intval($id) . "'";
$result = mysqli_query($connect, $query);



//while($row = $result->fetch_assoc()){
  //  echo $row['theorder'];
//}


?>