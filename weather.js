async function getWeather(city, elementId = "weather", lang = "en") {
    const apiKey = '71d91261f3134d148aa114746252203'; // вставь свой ключ
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=${lang}&aqi=no`);
    const data = await response.json();

    let windUnit;
    if (lang === "ru") windUnit = "км/ч";
    else if (lang === "sr") windUnit = "km/h";
    else windUnit = "kph";

    const container = document.getElementById(elementId);
    if (container) {
        container.innerHTML = `
            <p><strong>${data.location.name}</strong>: ${data.current.temp_c}°C, ${data.current.condition.text}, ${data.current.wind_kph} ${windUnit}</p>
            <img src="https:${data.current.condition.icon}" alt="Weather Icon">
        `;
    }
}
