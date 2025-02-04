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
    if (isset($data['active']) || isset($data['active_petrovac']) || isset($data['active_lastva']) || isset($data['active_braichi']) || isset($data['active_ploche'])) {
        // Путь к файлу JSON
        $file = 'active_schedule.json';

        // Читаем текущее содержимое файла
        $currentData = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

        // Обновляем данные для Budva-Sveti Stefan, если они переданы
        if (isset($data['active'])) {
            $currentData['active'] = $data['active'];
        }

        // Обновляем данные для Budva-Petrovac, если они переданы
        if (isset($data['active_petrovac'])) {
            $currentData['active_petrovac'] = $data['active_petrovac'];
        }

        // Обновляем данные для Budva-Lastva, если они переданы
        if (isset($data['active_lastva'])) {
            $currentData['active_lastva'] = $data['active_lastva'];
        }

        // Обновляем данные для Budva-braichi, если они переданы
        if (isset($data['active_braichi'])) {
            $currentData['active_braichi'] = $data['active_braichi'];
        }

       // Обновляем данные для Budva-ploche, если они переданы
        if (isset($data['active_ploche'])) {
            $currentData['active_ploche'] = $data['active_ploche'];
        }

        // Пытаемся записать данные в файл
        try {
            file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT)); // Здесь используется $currentData
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
