const apiKey = 'PiRnFs2pu8pCFrslg9HEcls9cf4nWlC5';
const lat = 35.2271;
const lon = -80.8431;
const url = `https://api.pirateweather.net/forecast/${apiKey}/${lat},${lon}?units=us`;

function trim(str, max = 120) {
  return str.length > max ? str.slice(0, max) + '...' : str;
}


fetch(url)
.then(res => res.json())
.then(data => {
  const current = data.currently;
  const weatherHTML = `
	<small class="section-label">Current Weather</small>
	<p><strong>${current.summary}</strong></p>
	<p>Temperature: ${Math.round(current.temperature)}°F</p>
	<p>Feels Like: ${Math.round(current.apparentTemperature)}°F</p>
	<p>Humidity: ${Math.round(current.humidity * 100)}%</p>
	<p>Wind: ${Math.round(current.windSpeed)} mph</p>
  `;
  document.getElementById('currentWeather').innerHTML = weatherHTML;
})
.catch(err => {
  document.getElementById('currentWeather').innerText = 'Failed to load weather.';
  console.error(err);
});





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

	


	  
	  


const gnewsApiKey = '11b9d06a21890b6749c2e8103fac5d0d';
const categories = [
  { category: 'nation', elementId: 'usNews', label: 'U.S. News' },
  { category: 'technology', elementId: 'techNews', label: 'Technology' },
  { category: 'sports', elementId: 'sportsNews', label: 'Sports' }
];

categories.forEach(({ category, elementId, label }) => {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=2&apikey=${gnewsApiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.articles || data.articles.length === 0) {
        document.getElementById(elementId).innerHTML = `<p>No ${label} headlines available.</p>`;
        return;
      }

      let html = `<small class="section-label">${label}</small>`<br />`;

      data.articles.forEach(article => {
        html += `
          <div class="news-article">
            <h3>${article.title}</h3>
            <p class="summary">${trim(article.description) || 'No summary available.'}</p>
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






	