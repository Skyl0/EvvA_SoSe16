<?php
$data = file_get_contents("php://input");
//echo ('My data: ' . $data);

$connect = mysqli_connect("localhost","root","","pizza") or die ('Could not connect: ' . mysql_error());

if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "SELECT * FROM orders";
$result = mysqli_query($connect, $query);
//echo "[";
while($row = $result->fetch_assoc()){
    echo $row['theorder'] ;
}
//echo "]";


?>