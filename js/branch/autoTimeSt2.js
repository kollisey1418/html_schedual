
async function updateStopsTimes2() {
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
      '2buses': 'sveti_stefan-budva_2buses.json',
      '3buses': 'sveti_stefan-budva_3buses.json',
      '4buses': 'sveti_stefan-budva_4buses.json',
      '5buses': 'sveti_stefan-budva_5buses.json',
      '6buses': 'sveti_stefan-budva_6buses.json'
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

// функция перевода времени в минуты
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  let total = h * 60 + m;
  // если время < 4 утра, считаем как следующий день
  if (h < 4) total += 24 * 60;
  return total;
}

const currentMinutes = timeToMinutes(currentTime);

let prev = null, next = null;
for (let i = 0; i < schedule.length; i++) {
  const scheduleMinutes = timeToMinutes(schedule[i].time);

  if (scheduleMinutes <= currentMinutes) prev = schedule[i];
  if (scheduleMinutes > currentMinutes) {
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
      'Sveti-s2', 'Vertmont-s2', 'Adrovich-s2', 'Kamenovo-s2', 'Rafailovichi-s2', 'Bella Vista-s2', 'Moc-s2', 'Mediteran-s2', 'Slavija-s2', 'Obshtina-s2', 'Budva-s2'
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
document.addEventListener('DOMContentLoaded', updateStopsTimes2);

document.getElementById('resetIntervalButton2').addEventListener('click', () => {
    if (window.innerWidth <= 550) {
        updateStopsTimes2(); // функция авто-тайма
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const intervalButton2 = document.getElementById('intervalButton2');
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
                        .then(activeData => {
                            let scheduleFile = '';
                            switch (activeData.active) {
                                case '2buses': scheduleFile = 'sveti_stefan-budva_2buses.json'; break;
                                case '3buses': scheduleFile = 'sveti_stefan-budva_3buses.json'; break;
                                case '4buses': scheduleFile = 'sveti_stefan-budva_4buses.json'; break;
                                case '5buses': scheduleFile = 'sveti_stefan-budva_5buses.json'; break;
                                case '6buses': scheduleFile = 'sveti_stefan-budva_6buses.json'; break;
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
                                    const ids = ["Sveti-s2", "Vertmont-s2", "Adrovich-s2", "Kamenovo-s2", "Rafailovichi-s2", "Bella Vista-s2", "Moc-s2", "Mediteran-s2", "Slavija-s2", "Obshtina-s2", "Budva-s2"];
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
                updateStopsTimes2(); // твоя функция autoTime для вставки времени по текущему часу
            }
        });
    }
});
