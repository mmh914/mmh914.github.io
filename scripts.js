// ======= CONFIGURATION =======
const pirateAPIKey = 'PiRnFs2pu8pCFrslg9HEcls9cf4nWlC5';
const currentWeatherUrl = `https://api.pirateweather.net/forecast/${pirateAPIKey}/${lat},${lon}?units=us&version=2&icon=pirate`;
const lat = 35.2271;
const lon = -80.8431;
const iconMap = {
  "clear-day": "wi-day-sunny",
  "clear-night": "wi-night-clear",
  "partly-cloudy-day": "wi-day-cloudy",
  "partly-cloudy-night": "wi-night-alt-cloudy",
  "cloudy": "wi-cloudy",
  "rain": "wi-rain",
  "sleet": "wi-sleet",
  "snow": "wi-snow",
  "wind": "wi-strong-wind",
  "fog": "wi-fog",
  "thunderstorm": "wi-thunderstorm",
  "hail": "wi-hail",
  "tornado": "wi-tornado"
  // Add more as needed from Pirate's extended icon list
};

const gnewsApiKey = '11b9d06a21890b6749c2e8103fac5d0d';
const categories = [
  { category: 'nation', elementId: 'usNews', label: 'U.S. News' },
  { category: 'technology', elementId: 'techNews', label: 'Technology' },
  { category: 'sports', elementId: 'sportsNews', label: 'Sports' }
];

// ======= UTILITY FUNCTIONS =======
/**
 * Trims a string to a specified max length and appends ellipsis if needed.
 * @param {string} str - The input string.
 * @param {number} max - Maximum allowed length.
 * @returns {string}
 */
function trimDescription(str, max = 120) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}

// ======= WEATHER: CURRENT CONDITIONS =======

fetch(currentWeatherUrl)
  .then(res => res.json())
  .then(data => {
    const current = data.currently;
    const iconClass = iconMap[current.icon] || "wi-na";  // fallback if missing
 		const weatherHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <i class="wi ${iconClass}" style="font-size: 48px;"></i>
        <div>
          <p style="margin: 0;">${Math.round(current.temperature)}°F</p>
          <p style="margin: 0; font-size: 0.85em;">Feels like: ${Math.round(current.apparentTemperature)}°F</p>
        </div>
      </div>
      <p style="margin-top: 0.5rem;">Rain Chance: ${Math.round(current.precipProbability * 100)}%</p>
      <p style="margin: 0;">UV Index: ${current.uvIndex}</p>
      <p style="margin: 0;">Cloud Cover: ${Math.round(current.cloudCover * 100)}%</p>
    `;
    document.getElementById('currentWeather').innerHTML = weatherHTML;
  })
  .catch(err => {
    document.getElementById('currentWeather').innerText = 'Failed to load weather.';
    console.error(err);
  });


// ======= WEATHER: 5-DAY FORECAST =======
const forecastUrl = `https://api.pirateweather.net/forecast/${apiKey}/${lat},${lon}?units=us`;

fetch(forecastUrl)
  .then(res => res.json())
  .then(data => {
    const daily = data.daily.data.slice(0, 5); // Next 5 days
    let html = '<small class="section-label">5-Day Forecast</small><div class="forecast-container">';

    daily.forEach(day => {
      const date = new Date(day.time * 1000).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      html += `
        <div class="forecast-day">
          <p><strong>${date}</strong></p>
          <p>${day.summary}</p>
          <p>High: ${Math.round(day.temperatureHigh)}°F</p>
          <p>Low: ${Math.round(day.temperatureLow)}°F</p>
        </div>
      `;
    });

    html += '</div>';
    document.getElementById('dailyForecast').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('dailyForecast').innerText = 'Failed to load forecast.';
    console.error(err);
  });

// ======= NEWS HEADLINES =======
categories.forEach(({ category, elementId, label }) => {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=2&apikey=${gnewsApiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.articles || data.articles.length === 0) {
        document.getElementById(elementId).innerHTML = `<p>No ${label} headlines available.</p>`;
        return;
      }

      let html = `<small class="section-label">${label}</small>`;

      data.articles.forEach(article => {
        html += `
          <div class="news-article">
            <h3>${article.title}</h3>
            <p class="summary">${trimDescription(article.description || 'No summary available.')}</p>
            <small>${new Date(article.publishedAt).toLocaleString()}</small>
          </div>
        `;
      });

      document.getElementById(elementId).innerHTML = html;
    })
    .catch(err => {
      document.getElementById(elementId).innerText = `Failed to load ${label} news.`;
      console.error(err);
    });
});