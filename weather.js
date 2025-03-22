async function getWeather(city, elementId = "weather") {
    const apiKey = '71d91261f3134d148aa114746252203'; // вставь свой ключ
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
    const data = await response.json();

    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = `
            <p><strong>${data.location.name}</strong>: ${data.current.temp_c}°C, ${data.current.condition.text}</p>
            <img src="https:${data.current.condition.icon}" alt="Weather Icon">
        `;
    }
}
