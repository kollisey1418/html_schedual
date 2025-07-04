
async function updateStopsTimes() {
  try {
    // 1. Получаем текущее время по Подгорице
    const now = new Date();
    const pad = num => String(num).padStart(2, '0');
    const currentTime = pad(now.getHours()) + ':' + pad(now.getMinutes());

    // 2. Загружаем active_schedule.json
    const activePt2Response = await fetch('active_schedule.json');
    const activePt2Data = await activePt2Response.json();

    // 3. Определяем нужный файл по active
    const active_petrovac = activePt2Data.active_petrovac;
    const fileMap = {
      '1bus': 'petrovac-budva_1bus.json',
      '2buses': 'petrovac-budva_2buses.json',
      '3buses': 'petrovac-budva_3buses.json'
    };
    const scheduleFile = fileMap[active_petrovac];
    if (!scheduleFile) {
      console.error('Unknown active_petrovac buses:', active_petrovac);
      return;
    }

    // 4. Загружаем расписание
    const scheduleResponse = await fetch(scheduleFile);
    const schedule = await scheduleResponse.json();

    // 5. Ищем два ближайших рейса
    let prev = null, next = null;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].time <= currentTime) prev = schedule[i];
      if (schedule[i].time > currentTime) {
        next = schedule[i];
        break;
      }
    }

    // Если нет предыдущего, берём первый
    if (!prev && schedule.length > 0) prev = schedule[0];
    // Если нет следующего, берём последний
    if (!next && schedule.length > 0) next = schedule[schedule.length - 1];

    if (!prev || !next) {
      console.error('No suitable times found in schedule');
      return;
    }

    // 6. Формируем массив из двух рейсов через запятую
    const combinedTimes = prev.osta.map((val, idx) => {
      const nextVal = next.osta[idx] || '';
      return val + ', ' + nextVal;
    });

    // 7. Вставляем в соответствующие span по id
    const ids = [
      'Petrovac-s2', 'Station-s2', 'Monastery-s2', 'Giardino-s2', 'Blizikuche-s2',
      'Rezhevichi-s2', 'Adrovich-s2', 'Kamenovo-s2', 'Rafailovichi-s2', 'Bella Vista-s2', 'Moc-s2',
      'Mediteran-s2', 'Slavija-s2', 'Obshtina-s2', 'Budva-s2'
    ];

    ids.forEach((id, idx) => {
      const span = document.getElementById(id);
      if (span) {
        span.textContent = combinedTimes[idx] || '-';
      }
    });

  } catch (err) {
    console.error('Error updating stop times:', err);
  }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', updateStopsTimes);

document.getElementById('resetIntervalButton2').addEventListener('click', () => {
    if (window.innerWidth <= 550) {
        updateStopsTimes(); // функция авто-тайма
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const intervalButton = document.getElementById('intervalButton2');
    const resetButton2 = document.getElementById('resetIntervalButton2');

    // Проверка, что мы на мобильной версии
    if (window.innerWidth <= 550 && intervalButton2) {

        // Клик по кнопке выбора интервала
        intervalButton2.addEventListener('click', () => {
            // Ждем выбора пункта меню
            document.getElementById('intervalDropdown2').addEventListener('click', function handleClick(event) {
                if (event.target.tagName === 'A') {
                    const selectedInterval2 = event.target.dataset.interval;

                    // Загружаем данные (пример на fetch)
                    fetch('active_schedule.json')
                        .then(res => res.json())
                        .then(activePt2Data => {
                            let scheduleFile = '';
                            switch (activePt2Data.active_petrovac) {
                                case '1bus': scheduleFile = 'petrovac-budva_1bus.json'; break;
                                case '2buses': scheduleFile = 'petrovac-budva_2buses.json'; break;
                                case '3buses': scheduleFile = 'petrovac-budva_3buses.json'; break;
                                default: return;
                            }

                            fetch(scheduleFile)
                                .then(res => res.json())
                                .then(schedule => {
                                    const [start, end] = selectedInterval2.split('-');

                                    const filtered = schedule.filter(({ time }) => {
                                        if (start > end) {
                                            return time >= start || time <= end;
                                        }
                                        return time >= start && time <= end;
                                    });

                                    // Вставка значений в span
                                    const ids = ["Petrovac-s2", "Station-s2", "Monastery-s2", "Giardino-s2", "Blizikuche-s2",
      "Rezhevichi-s2", "Adrovich-s2", "Kamenovo-s2", "Rafailovichi-s2", "Bella Vista-s2", "Moc-s2",
      "Mediteran-s2", "Slavija-s2", "Obshtina-s2", "Budva-s2"];
                                    if (filtered.length > 0) {
    // создаём массив с 11 пустыми строками
    const combined = Array(ids.length).fill('');

    // проходим по каждому результату
    filtered.forEach(result => {
        result.osta.forEach((time, index) => {
            if (combined[index]) {
                combined[index] += ', ' + time; // добавляем через запятую
            } else {
                combined[index] = time;
            }
        });
    });

    // вставляем в HTML
    ids.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) el.textContent = combined[index] || '-';
    });
}

                                });
                        });

                    // Убираем слушатель после выбора
                    this.removeEventListener('click', handleClick);
                }
            });
        });
    }

    // Кнопка Reset
    if (resetButton2) {
        resetButton2.addEventListener('click', () => {
            if (window.innerWidth <= 550) {
                // Запуск авто-тайма только на мобильной версии
                autoTime(); // твоя функция autoTime для вставки времени по текущему часу
            }
        });
    }
});
