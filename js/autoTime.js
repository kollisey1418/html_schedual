
async function updateStopsTimes() {
  try {
    // 1. Получаем текущее время по Подгорице
    const now = new Date();
    const pad = num => String(num).padStart(2, '0');
    const currentTime = pad(now.getHours()) + ':' + pad(now.getMinutes());

    // 2. Загружаем active_schedule.json
    const activeResponse = await fetch('active_schedule.json');
    const activeData = await activeResponse.json();

    // 3. Определяем нужный файл по active
    const active = activeData.active;
    const fileMap = {
      '2buses': 'budva-sveti_stefan_2buses.json',
      '3buses': 'budva-sveti_stefan_3buses.json',
      '4buses': 'budva-sveti_stefan_4buses.json',
      '5buses': 'budva-sveti_stefan_5buses.json',
      '6buses': 'budva-sveti_stefan_6buses.json'
    };
    const scheduleFile = fileMap[active];
    if (!scheduleFile) {
      console.error('Unknown active buses:', active);
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
      'Budva-s', 'Crvena-s', 'Stadion-s', 'Mediteran-s', 'Moc-s',
      'Bella Vista-s', 'Rafailovichi-s', 'Kamenovo-s',
      'Maestral-s', 'Przhno-s', 'Sveti-s'
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

document.getElementById('resetIntervalButton').addEventListener('click', () => {
    if (window.innerWidth <= 550) {
        updateStopsTimes(); // функция авто-тайма
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const intervalButton = document.getElementById('intervalButton');
    const resetButton = document.getElementById('resetIntervalButton');

    // Проверка, что мы на мобильной версии
    if (window.innerWidth <= 550 && intervalButton) {

        // Клик по кнопке выбора интервала
        intervalButton.addEventListener('click', () => {
            // Ждем выбора пункта меню
            document.getElementById('intervalDropdown').addEventListener('click', function handleClick(event) {
                if (event.target.tagName === 'A') {
                    const selectedInterval = event.target.dataset.interval;

                    // Загружаем данные (пример на fetch)
                    fetch('active_schedule.json')
                        .then(res => res.json())
                        .then(activeData => {
                            let scheduleFile = '';
                            switch (activeData.active) {
                                case '2buses': scheduleFile = 'budva-sveti_stefan_2buses.json'; break;
                                case '3buses': scheduleFile = 'budva-sveti_stefan_3buses.json'; break;
                                case '4buses': scheduleFile = 'budva-sveti_stefan_4buses.json'; break;
                                case '5buses': scheduleFile = 'budva-sveti_stefan_5buses.json'; break;
                                case '6buses': scheduleFile = 'budva-sveti_stefan_6buses.json'; break;
                                default: return;
                            }

                            fetch(scheduleFile)
                                .then(res => res.json())
                                .then(schedule => {
                                    const [start, end] = selectedInterval.split('-');

                                    const filtered = schedule.filter(({ time }) => {
                                        if (start > end) {
                                            return time >= start || time <= end;
                                        }
                                        return time >= start && time <= end;
                                    });

                                    // Вставка значений в span
                                    const ids = ["Budva-s","Crvena-s","Stadion-s","Mediteran-s","Moc-s","Bella Vista-s","Rafailovichi-s","Kamenovo-s","Maestral-s","Przhno-s","Sveti-s"];
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
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (window.innerWidth <= 550) {
                // Запуск авто-тайма только на мобильной версии
                autoTime(); // твоя функция autoTime для вставки времени по текущему часу
            }
        });
    }
});
