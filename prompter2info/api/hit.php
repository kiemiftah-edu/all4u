<?php
// Sembunyikan ralat PHP standard (Elak format JSON rosak)
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Pastikan fail konfigurasi wujud
if (!file_exists('db_config.php')) {
    echo json_encode(["total" => "0", "error" => "Fail db_config.php tiada"]);
    exit;
}

// PENYELESAIAN ERROR 500: Guna try...catch untuk menangkap Fatal Exception (PHP 8.1+)
try {
    include 'db_config.php';
    
    // Pastikan sambungan database berjaya
    if (!$conn || $conn->connect_error) {
        echo json_encode(["total" => "0", "error" => "Tiada sambungan DB"]);
        exit;
    }

    $page_id = 'home'; // ID unik untuk app ini

    // 1. Tambah (Increment) Hit (Guna backtick untuk `count` sebab ia kata kunci SQL)
    $sql_update = "UPDATE hits SET `count` = `count` + 1 WHERE page_id = ?";
    $stmt = $conn->prepare($sql_update);

    if ($stmt) {
        $stmt->bind_param("s", $page_id);
        $stmt->execute();

        // Jika tiada rekod, insert baru
        if ($stmt->affected_rows === 0) {
            $sql_insert = "INSERT INTO hits (page_id, `count`) VALUES (?, 1)";
            $stmt_insert = $conn->prepare($sql_insert);
            if ($stmt_insert) {
                $stmt_insert->bind_param("s", $page_id);
                $stmt_insert->execute();
                $stmt_insert->close();
            }
        }
        $stmt->close();
    }

    // 2. Dapatkan Jumlah Terkini
    $sql_get = "SELECT `count` FROM hits WHERE page_id = ?";
    $stmt_get = $conn->prepare($sql_get);

    $total = 0;

    if ($stmt_get) {
        $stmt_get->bind_param("s", $page_id);
        $stmt_get->execute();
        $result = $stmt_get->get_result();

        if ($row = $result->fetch_assoc()) {
            $total = $row['count'];
        }

        $stmt_get->close();
    }

    $conn->close();

    // 3. Pulangkan JSON dengan sukses
    echo json_encode(["total" => number_format($total)]);

} catch (Exception $e) {
    // JIKA BERLAKU ERROR (Contoh: table tak wujud), JANGAN CRASH 500!
    // Pulangkan nilai 0 dan tunjukkan punca masalah supaya mudah dikesan.
    echo json_encode([
        "total" => "0", 
        "error_message" => $e->getMessage()
    ]);
}
?>