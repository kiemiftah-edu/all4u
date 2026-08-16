<?php
$servername = "localhost";
$username = "u243837409_comixsprompter"; // Gantikan dengan username database anda
$password = "WQM@4620_viva"; // Gantikan dengan password database anda
$dbname = "u243837409_comixsprompter"; // Gantikan dengan nama database anda

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>