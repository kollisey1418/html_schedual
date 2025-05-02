<?php
// Установка языка по ссылке (по HTTP_REFERER)
$lang = 'en'; // по умолчанию

if (isset($_SERVER['HTTP_REFERER'])) {
    $ref = $_SERVER['HTTP_REFERER'];
    if (strpos($ref, '_ru') !== false) {
        $lang = 'ru';
    } elseif (strpos($ref, '_me') !== false) {
        $lang = 'me';
    }
}

// Массив переводов
$translations = [
    'en' => [
        'thanks' => 'Thank you for your feedback!',
        'back'   => 'Return to the site',
        'error'  => 'Error while sending message.',
        'denied' => 'Access denied.',
    ],
    'ru' => [
        'thanks' => 'Спасибо за ваш отзыв!',
        'back'   => 'Вернуться на сайт',
        'error'  => 'Ошибка при отправке сообщения.',
        'denied' => 'Доступ запрещён.',
    ],
    'me' => [
        'thanks' => 'Hvala na vašem komentaru!',
        'back'   => 'Povratak na sajt',
        'error'  => 'Greška prilikom slanja poruke.',
        'denied' => 'Pristup odbijen.',
    ]
];

// Укороченная переменная перевода
$t = $translations[$lang];

// Подключаемся к базе данных
$db = new SQLite3(__DIR__ . '/feedback.db');

// Создаём таблицу при необходимости
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

// Проверка метода
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Принимаем данные
    $first_name = htmlspecialchars(trim($_POST['first_name'] ?? ''));
    $last_name  = htmlspecialchars(trim($_POST['last_name'] ?? ''));
    $email      = htmlspecialchars(trim($_POST['email'] ?? ''));
    $location   = htmlspecialchars(trim($_POST['location'] ?? ''));
    $message    = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Подготавливаем и выполняем SQL-запрос
    $stmt = $db->prepare("
        INSERT INTO feedback (first_name, last_name, email, location, message)
        VALUES (:first_name, :last_name, :email, :location, :message)
    ");

    $stmt->bindValue(':first_name', $first_name, SQLITE3_TEXT);
    $stmt->bindValue(':last_name',  $last_name,  SQLITE3_TEXT);
    $stmt->bindValue(':email',      $email,      SQLITE3_TEXT);
    $stmt->bindValue(':location',   $location,   SQLITE3_TEXT);
    $stmt->bindValue(':message',    $message,    SQLITE3_TEXT);

    if ($stmt->execute()) {
        echo "<h2>{$t['thanks']}</h2>";
        $backLink = '/'; // по умолчанию

if (isset($_SERVER['HTTP_REFERER'])) {
    $parsed = parse_url($_SERVER['HTTP_REFERER']);
    $backLink = $parsed['path'] ?? '/';
}

echo '<a href="' . htmlspecialchars($backLink) . '">' . $t['back'] . '</a>';

    } else {
        echo $t['error'];
    }
} else {
    echo $t['denied'];
}
?>
