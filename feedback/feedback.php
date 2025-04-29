<?php
// 1. Подключаемся к (или создаём) базу данных
$db = new SQLite3(__DIR__ . '/feedback.db');

// 2. Создаём таблицу, если её ещё нет
$db->exec("
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

// 3. Проверяем, что форма отправлена методом POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Безопасно принимаем данные
    $first_name = htmlspecialchars(trim($_POST['first_name']));
    $last_name  = htmlspecialchars(trim($_POST['last_name']));
    $email      = htmlspecialchars(trim($_POST['email']));
    $location   = htmlspecialchars(trim($_POST['location']));
    $message    = htmlspecialchars(trim($_POST['message']));

    // 4. Подготавливаем запрос
    $stmt = $db->prepare("
        INSERT INTO feedback (first_name, last_name, email, location, message)
        VALUES (:first_name, :last_name, :email, :location, :message)
    ");

    $stmt->bindValue(':first_name', $first_name, SQLITE3_TEXT);
    $stmt->bindValue(':last_name',  $last_name,  SQLITE3_TEXT);
    $stmt->bindValue(':email',      $email,      SQLITE3_TEXT);
    $stmt->bindValue(':location',   $location,   SQLITE3_TEXT);
    $stmt->bindValue(':message',    $message,    SQLITE3_TEXT);

    // 5. Выполняем запрос
    if ($stmt->execute()) {
        echo "<h2>Спасибо за ваш отзыв!</h2>";
        echo '<a href="/">Вернуться на сайт</a>';
    } else {
        echo "Ошибка при отправке сообщения.";
    }
} else {
    echo "Доступ запрещён.";
}
?>
