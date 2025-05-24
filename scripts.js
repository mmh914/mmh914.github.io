// ======= CONFIGURATION =======

// Pirate Weather API configuration
const pirateAPIKey = 'PiRnFs2pu8pCFrslg9HEcls9cf4nWlC5';
const lat = 35.2271;
const lon = -80.8431;
const currentWeatherUrl = `https://api.pirateweather.net/forecast/${pirateAPIKey}/${lat},${lon}?units=us&version=2&icon=pirate`;
const forecastUrl = `https://api.pirateweather.net/forecast/${pirateAPIKey}/${lat},${lon}?units=us`;
let dailyPrecipitation = JSON.parse(localStorage.getItem('dailyPrecipitation')) || [0, 0, 0, 0, 0, 0, 0];
let weeklyPrecipitation = 0;

// Map of Pirate Weather icon names to Weather Icons classes
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

// GNews configuration
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

/**
 * Fetches and displays the current weather in module-b.
 */
function updateCurrentWeather() {
  fetch(currentWeatherUrl)
    .then(res => res.json())
    .then(data => {
      const current = data.currently;
      const iconClass = iconMap[current.icon] || "wi-na"; // fallback icon if unknown
      weeklyPrecipitation = dailyPrecipitation.reduce((sum, val) => sum + val, 0);
      

      const weatherHTML = `
        <small class="section-label">Current Conditions</small>
        <div class="weather-strip">
          <i class="wi ${iconClass} weather-icon"></i>
          <span class="weather-data">${Math.round(current.temperature)}°F</span>
          <span class="weather-data">🌧️${Math.round(current.precipProbability * 100)}%</span>
          <span class="weather-data">☀️${Math.round(current.uvIndex)}</span>
          <span class="weather-data">☁️${Math.round(current.cloudCover * 100)}%</span>
          <span class="weather-data">💧${(weeklyPrecipitation).toFixed(1)}"</span>
        </div>
      `;

      document.getElementById('currentWeather').innerHTML = weatherHTML;
    })
    .catch(err => {
      document.getElementById('currentWeather').innerText = 'Failed to load weather.';
      console.error(err);
    });
}

// ======= WEATHER: 5-DAY FORECAST =======

/**
 * Fetches and displays a 5-day weather forecast.
 */
function updateForecast() {
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
}

// ======= NEWS HEADLINES =======

/**
 * Fetches and displays top headlines for each configured category.
 */
function updateNews() {
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
}

// ======= INITIALIZATION =======

// Initial load
updateCurrentWeather();
updateForecast();
updateNews();


// Update every hour
setInterval(() => {
  updateCurrentWeather();
  updateForecast();
  updateNews();
}, 60 * 60 * 1000);

// ======= DAILY RELOAD =======

function recordDailyPrecipitation() {
  fetch(currentWeatherUrl)
    .then(res => res.json())
    .then(data => {
      const currentLiquid = data.currently?.currentDayLiquid || 0;

      dailyPrecipitation.push(currentLiquid);
      if (dailyPrecipitation.length > 7) {
        dailyPrecipitation.shift();
      }

      localStorage.setItem('dailyPrecipitation', JSON.stringify(dailyPrecipitation));
      console.log('Updated 7-day precipitation:', dailyPrecipitation);
    })
    .catch(err => {
      console.error('Failed to record daily precipitation:', err);
    });
    weeklyPrecipitation = dailyPrecipitation.reduce((sum, val) => sum + val, 0);
}



/**
 * Schedules a full page reload at a specified time daily.
 * Default is 3:00 AM.
 * @param {number} hour - Hour (0–23)
 * @param {number} minute - Minute (0–59)
 */
function scheduleDailyReload(hour = 23, minute = 58) {
  const now = new Date();
  const reloadTime = new Date();
  

  reloadTime.setHours(hour);
  reloadTime.setMinutes(minute);
  reloadTime.setSeconds(0);
  reloadTime.setMilliseconds(0);

  // If the scheduled time has already passed today, schedule for tomorrow
  if (now > reloadTime) {
    reloadTime.setDate(reloadTime.getDate() + 1);
  }

  const msUntilReload = reloadTime.getTime() - now.getTime();

  setTimeout(() => {
    // Step 1: Log precipitation for the day
    recordDailyPrecipitation();

    // Step 2: Wait a few seconds, then reload the page
    setTimeout(() => {
      location.reload();
    }, 5000); // wait 5 seconds after recording
  }, msUntilReload);
}

scheduleDailyReload(); // Reload at 11:58 PM
