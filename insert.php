<?php
$data = file_get_contents("php://input");
//echo ('My data: ' . $data);

$connect = mysqli_connect("localhost","root","","pizza") or die ('Could not connect: ' . mysql_error());

if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$query = "INSERT INTO orders VALUES ('$data',NULL)";
mysqli_query($connect, $query);

printf ("This order has the id %d.\n", mysqli_insert_id($connect));

?>