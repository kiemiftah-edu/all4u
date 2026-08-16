<?php
// api/hit.php
declare(strict_types=1);

header("Content-Type: application/json");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

require __DIR__ . "/db.php";

// (Optional) elak “refresh spam”: kira 1 hit per session
session_start();
if (!isset($_SESSION["hit_counted"])) {
  $_SESSION["hit_counted"] = true;

  // atomic increment
  $pdo->exec("UPDATE hit_counter SET total = total + 1 WHERE id = 1");
}

// get total
$stmt = $pdo->query("SELECT total FROM hit_counter WHERE id = 1 LIMIT 1");
$row = $stmt->fetch();

echo json_encode(["ok" => true, "total" => (int)($row["total"] ?? 0)]);
