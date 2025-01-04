<?php
// Устанавливаем заголовки для CORS, если вы хотите использовать fetch
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем, что данные пришли методом POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Читаем JSON из тела запроса
    $data = json_decode(file_get_contents('php://input'), true);

    // Проверяем, что поле "active" существует
    if (isset($data['active'])) {
        // Путь к файлу JSON
        $file = 'active_schedule.json';

        // Пытаемся записать данные в файл
        try {
            file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status' => 'success', 'message' => 'Schedule updated successfully.']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update schedule.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid data.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
