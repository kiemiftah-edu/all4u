<?php
$host = "localhost";
$user = "u243837409_webtoongen";
$pass = "WQM@4620_viva";
$dbname = "u243837409_webtoongen";

// Elakkan output ralat mengganggu response JSON API
error_reporting(0);
ini_set('display_errors', 0);

$conn = @new mysqli($host, $user, $pass, $dbname);

if ($conn && !$conn->connect_error) {
    $conn->set_charset('utf8mb4');
}
?>
