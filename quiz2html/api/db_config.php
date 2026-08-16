<?php
// Masukkan maklumat pangkalan data anda di sini
$servername = "localhost";
$username = "u243837409_eflip"; 
$password = "WQM@4620_viva"; 
$dbname = "u243837409_eflip";     

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>