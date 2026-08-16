<?php
/**
 * Fail: api/hits.php
 * Fungsi: Merekod jumlah pelawat ke dalam database MySQL.
 * Cara Pasang:
 * 1. Buat database di cPanel (MySQL Database Wizard).
 * 2. Kemaskini $host, $user, $pass, $dbname di bawah.
 * 3. Muat naik fail ini ke folder 'api/' di hosting anda.
 */

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Benarkan akses dari domain lain jika perlu
header("Access-Control-Allow-Methods: POST, GET");

// --- KONFIGURASI DATABASE (SILA UBAH DI SINI) ---
$host = "localhost";
$user = "u243837409_voxdrop";  // Cth: u12345_admin
$pass = "WQM@4620_viva";  // Cth: passwordKuat123
$dbname = "u243837409_voxdrop";    // Cth: u12345_voxdrop

try {
    // Sambungan ke Database menggunakan PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Cipta table secara automatik jika belum wujud (Self-setup)
    $sql_create = "CREATE TABLE IF NOT EXISTS site_stats (
        id INT PRIMARY KEY,
        hit_count INT DEFAULT 0
    )";
    $pdo->exec($sql_create);

    // 2. Masukkan baris pertama jika kosong
    $sql_init = "INSERT IGNORE INTO site_stats (id, hit_count) VALUES (1, 0)";
    $pdo->exec($sql_init);

    // 3. Tambah hit (+1)
    $stmt = $pdo->prepare("UPDATE site_stats SET hit_count = hit_count + 1 WHERE id = 1");
    $stmt->execute();

    // 4. Ambil jumlah terkini untuk dihantar ke VoxDrop
    $stmt = $pdo->prepare("SELECT hit_count FROM site_stats WHERE id = 1");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Pulangkan JSON
    echo json_encode([
        'status' => 'success',
        'count' => (int)$result['hit_count']
    ]);

} catch (PDOException $e) {
    // Jika berlaku ralat (contoh: database tak jumpa), pulangkan count 0 supaya app tak crash
    // Dalam production, anda boleh buang 'error_msg' untuk keselamatan
    echo json_encode([
        'status' => 'error',
        'count' => 0, 
        'error_msg' => $e->getMessage()
    ]);
}
?>