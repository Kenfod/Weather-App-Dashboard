document.addEventListener('DOMContentLoaded', () => {
  
 /* =========================
     1. DOM ELEMENTS
  ========================== */

  const cityInput = document.getElementById('cityInput');
  const unitSelect = document.getElementById('unitSelect');
  const searchBtn = document.getElementById('searchBtn');
  const toggleView = document.getElementById('toggleView');
  const weatherDiv = document.getElementById('weather');
  const statusEl = document.getElementById('status');
  const chartCanvas = document.getElementById('weatherChart');
  const cityNameEl = document.getElementById('cityName');

  /* =========================
     2. STATE
  ========================== */

  let chart = null;
  let isChartView = false; 
  let lastFetchKey = null;
  let lastWeatherData = null;
  let lastTimezoneOffset = 0;

  /* =========================
      3. INITIALIZATION & PREFERENCES
  ========================== */
  cityInput.value = localStorage.getItem('city') || 'Dubai';
  unitSelect.value = localStorage.getItem('units') || 'metric';

  function savePreferences() {
    localStorage.setItem('city', cityInput.value.trim());
    localStorage.setItem('units', unitSelect.value);
  }

  function handleError(message) {
    weatherDiv.innerHTML = `<div class="weather-item">⚠️ ${message}</div>`;
    statusEl.textContent = '';
  }

  /* =========================
     4. TIME HELPERS
  ========================== */
  function getCityLocalTime(timezoneOffset) {
    const nowUtc = Date.now();
    const localTime = new Date(nowUtc + timezoneOffset * 1000);

    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }


  /* =========================
      5. RENDERING FUNCTIONS
  ========================== */
  
  // This builds the small weather cards
  function renderWeatherList(data, units) {
    weatherDiv.innerHTML = '';
    const unitLabel = units === 'metric' ? '°C' : '°F';

    data.forecast.slice(0, 5).forEach(item => {

      // Calculate local time: (UTC timestamp + offset) * 1000 to get milliseconds
      const localDate = new Date((item.dt + lastTimezoneOffset) * 1000);
    
      // 2. Get the Day Name (e.g., "Monday")
      // We use 'UTC' as the timezone here because we already manually applied the offset
      const dayName = localDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      
      // We use getUTC methods because the offset is already added to the time
      const hours = localDate.getUTCHours().toString().padStart(2, '0');
      const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
      const localTime = `${hours}:${minutes}`;

      // Get the icon code from the API (e.g., "01d", "04n")
      const iconCode = item.weather[0].icon;
      // Construct the URL for the icon
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const div = document.createElement('div');
      div.className = 'weather-item';
      div.innerHTML = `
        <span class="day-label">${dayName}</span>
        <strong>${localTime}</strong>
        <img src="${iconUrl}" alt="${item.weather[0].description}" class="weather-icon" />
        <p>🌡 ${Math.round(item.main.temp)}${unitLabel}</p>
        <p class="desc">${item.weather[0].description}</p>
      `;
      weatherDiv.appendChild(div);
    });
  }

  // This draws the chart on the canvas
    function renderChart(data, units) {
      const labels = data.forecast.slice(0, 8).map(item => {
      const localDate = new Date((item.dt + lastTimezoneOffset) * 1000);
      const hours = localDate.getUTCHours().toString().padStart(2, '0');
      const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    const temps = data.forecast.slice(0, 8).map(i => i.main.temp);

    // If a chart already exists, we must destroy it before drawing a new one
    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Temp (${units === 'metric' ? '°C' : '°F'})`,
          data: temps,
          borderColor: '#00feba',
          backgroundColor: 'rgba(0, 254, 186, 0.1)',
          fill: true,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  /* =========================
      6. CORE LOGIC (FETCH & TOGGLE)
  ========================== */

  function fetchWeather() {
    const city = cityInput.value.trim() || 'Dubai';
    const units = unitSelect.value;
    const fetchKey = `${city}_${units}`;

    // Optimization: avoid API calls for the same search
    if (fetchKey === lastFetchKey && lastWeatherData) return;

    lastFetchKey = fetchKey;
    statusEl.textContent = 'Loading weather data…';

    const url = `/api?q=${city}&units=${units}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('City not found');
        return res.json();
      })
      .then(data => {
        statusEl.textContent = '';
        lastWeatherData = data;
        lastTimezoneOffset = data.timezone; // Save timezone to global variable

        // Update the City Name Display
        const cityTime = getCityLocalTime(data.timezone);
        cityNameEl.textContent = `Weather in ${data.city}, ${data.country}\nCurrent Time - ${cityTime} hrs`;

        // Pass the offset to the render functions
        renderWeatherList(data, units);
        renderChart(data, units);

        // Keep chart visibility in sync with the button state
        chartCanvas.classList.toggle('hidden', !isChartView);

      })
      .catch(error => handleError(error.message));
  }

  function toggleDisplay() {
    isChartView = !isChartView;

    // Show/Hide ONLY the chart
    chartCanvas.classList.toggle('hidden', !isChartView);

    // Update the button text
    toggleView.textContent = isChartView ? 'Hide Chart' : 'Show Chart';

    // Chart.js resize fix for hidden elements
    if (isChartView && chart) {
      setTimeout(() => chart.resize(), 50);
    }
  }

  /* =========================
      7. START THE APP
  ========================== */
  searchBtn.addEventListener('click', () => {
    savePreferences();
    fetchWeather();
  });

  toggleView.addEventListener('click', toggleDisplay);

  // Initial fetch on page load
  fetchWeather();
});
