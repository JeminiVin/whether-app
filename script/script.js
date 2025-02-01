const apiKey = "5b34919f5000ccaa471d279e6ea59c85"; 

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    displayError("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      updateUI(data);
    } else {
      displayError("City not found. Please try again.");
    }
  };

  xhr.onerror = function () {
    displayError("Error occur in fetching data. Please check your connection.");
  };

  xhr.send();
}

function updateUI(data) {
  document.getElementById("errorMessage").innerText = "";
  document.getElementById("weatherInfo").style.display = "block";

  document.getElementById("cityName").innerText = data.name;
  document.getElementById(
    "temperature"
  ).innerText = `Temperature: ${data.main.temp}°C`;
  document.getElementById(
    "humidity"
  ).innerText = `Humidity: ${data.main.humidity}%`;
  document.getElementById(
    "condition"
  ).innerText = `Condition: ${data.weather[0].description}`;
  document.getElementById(
    "weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function displayError(message) {
  document.getElementById("errorMessage").innerText = message;
  document.getElementById("weatherInfo").style.display = "none";
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          updateUI(data);
        } else {
          displayError("Could not retrieve location data.");
        }
      };

      xhr.onerror = function () {
        displayError("Error fetching location weather.");
      };

      xhr.send();
    });
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
}
window.onload = getWeatherByLocation;

let isCelsius = true;

function toggleUnit() {
  const tempElement = document.getElementById("temperature");
  const tempValue = parseFloat(tempElement.innerText.split(": ")[1]);

  if (isCelsius) {
    tempElement.innerText = `Temperature: ${((tempValue * 9) / 5 + 32).toFixed(
      1
    )}°F`;
  } else {
    tempElement.innerText = `Temperature: ${(
      ((tempValue - 32) * 5) /
      9
    ).toFixed(1)}°C`;
  }

  isCelsius = !isCelsius;
}

document.getElementById("temperature").addEventListener("click", toggleUnit);
