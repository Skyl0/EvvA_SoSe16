<?php
$data = file_get_contents("php://input");
//echo ('My data: ' . $data);

$connect = mysqli_connect("localhost","root","","pizza") or die ('Could not connect: ' . mysql_error());

if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$isfirst = true;

$query = "SELECT * FROM orders WHERE archive = 0";
$result = mysqli_query($connect, $query);
echo '{"allorders":[';
while($row = $result->fetch_assoc()){
	$id = $row['id'];
	$theorder = $row['theorder'];
	if ($isfirst) {
		echo '{"rowid":' . $id . ',' . substr($theorder,1) . '';
		$isfirst = false;
	} else {
		echo ',' . '{"rowid":' . $id . ',' . substr($theorder,1) . '';
	}    
}
echo "]}";


?>