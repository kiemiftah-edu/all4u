<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 

include 'db_config.php';

$page_id = 'home';

// 1. Tambah (Increment) Hit
$sql_update = "UPDATE hits SET count = count + 1 WHERE page_id = ?";
$stmt = $conn->prepare($sql_update);
$stmt->bind_param("s", $page_id);
$stmt->execute();

// Jika tiada rekod, masukkan rekod baru
if ($stmt->affected_rows === 0) {
    $sql_insert = "INSERT INTO hits (page_id, count) VALUES (?, 1)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("s", $page_id);
    $stmt_insert->execute();
    $stmt_insert->close();
}
$stmt->close();

// 2. Dapatkan Jumlah Terkini
$sql_get = "SELECT count FROM hits WHERE page_id = ?";
$stmt_get = $conn->prepare($sql_get);
$stmt_get->bind_param("s", $page_id);
$stmt_get->execute();
$result = $stmt_get->get_result();

$total = 0;
if ($row = $result->fetch_assoc()) {
    $total = $row['count'];
}

$stmt_get->close();
$conn->close();

// 3. Hantar JSON
echo json_encode(["total" => number_format($total)]);
?>