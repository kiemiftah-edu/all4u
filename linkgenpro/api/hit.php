<?php
/**
 * Fail: api/hit.php
 * Kegunaan: Mengemas kini dan memaparkan jumlah pelawat (hitstat)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Membenarkan akses silang domain jika perlu

// --- KONFIGURASI DATABASE ---
// Sila tukar maklumat di bawah mengikut hosting anda
$host = 'localhost';
$db   = 'u243837409_linkgen'; 
$user = 'u243837409_linkgen';
$pass = 'WQM@4620_viva';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Memulakan sambungan ke database
    $pdo = new PDO($dsn, $user, $pass, $options);

    // 1. Tambah jumlah hit (+1) setiap kali API dipanggil
    $updateStmt = $pdo->prepare("UPDATE site_stats SET total_hits = total_hits + 1 WHERE id = 1");
    $updateStmt->execute();

    // 2. Ambil jumlah terkini
    $selectStmt = $pdo->query("SELECT total_hits FROM site_stats WHERE id = 1");
    $row = $selectStmt->fetch();
    
    $total = $row ? $row['total_hits'] : 0;

    // Menghantar respon dalam format JSON
    echo json_encode([
        'status' => 'success',
        'total' => number_format($total) // Format dengan koma jika perlu
    ]);

} catch (\PDOException $e) {
    // Jika berlaku ralat sambungan
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal menyambung ke pangkalan data'
    ]);
}
?>