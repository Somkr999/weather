// Weather App JavaScript - Simple and Clean

// DOM Elements - Get references to HTML elements we'll manipulate
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const error = document.getElementById('error');

// Weather API configuration
const API_KEY = 'cd45d1432ea5444084073227252807'; // Your API key
const BASE_URL = 'http://api.weatherapi.com/v1';

/**
 * Show loading spinner and hide other elements
 */
function showLoading() {
    loading.classList.remove('d-none');
    currentWeather.classList.add('d-none');
    forecast.classList.add('d-none');
    error.classList.add('d-none');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    loading.classList.add('d-none');
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    hideLoading();
    document.getElementById('errorMessage').textContent = message;
    error.classList.remove('d-none');
    currentWeather.classList.add('d-none');
    forecast.classList.add('d-none');
}

/**
 * Get current date in a readable format
 * @returns {string} Formatted date string
 */
function getCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
}

/**
 * Format date for forecast cards
 * @param {string} dateString - Date string from API
 * @returns {string} Formatted date
 */
function formatForecastDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Display current weather information
 * @param {Object} data - Weather data from API
 */
function displayCurrentWeather(data) {
    // Extract data from API response
    const location = data.location;
    const current = data.current;
    
    // Update DOM elements with weather data
    document.getElementById('location').textContent = `${location.name}, ${location.country}`;
    document.getElementById('date').textContent = getCurrentDate();
    document.getElementById('weatherIcon').src = `https:${current.condition.icon}`;
    document.getElementById('description').textContent = current.condition.text;
    document.getElementById('temperature').textContent = `${Math.round(current.temp_c)}°C`;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.feelslike_c)}°C`;
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('wind').textContent = `${current.wind_kph} km/h`;
    document.getElementById('uv').textContent = current.uv;
    
    // Show the current weather card with animation
    currentWeather.classList.remove('d-none');
    currentWeather.classList.add('fade-in');
}

/**
 * Display 7-day forecast
 * @param {Object} data - Forecast data from API
 */
function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    
    // Clear previous forecast data
    forecastContainer.innerHTML = '';
    
    // Loop through forecast days and create cards
    data.forecast.forecastday.forEach((day, index) => {
        // Create forecast card HTML
        const forecastCard = document.createElement('div');
        forecastCard.className = 'col-md-4 col-lg-3 col-6';
        
        forecastCard.innerHTML = `
            <div class="card forecast-card h-100">
                <div class="card-body text-center">
                    <h6 class="card-title">${index === 0 ? 'Today' : formatForecastDate(day.date)}</h6>
                    <img src="https:${day.day.condition.icon}" alt="Weather" class="forecast-icon mb-2">
                    <p class="card-text small text-muted mb-1">${day.day.condition.text}</p>
                    <div class="d-flex justify-content-between">
                        <span class="fw-bold text-primary">${Math.round(day.day.maxtemp_c)}°</span>
                        <span class="text-muted">${Math.round(day.day.mintemp_c)}°</span>
                    </div>
                    <small class="text-muted d-block mt-1">Rain: ${day.day.daily_chance_of_rain}%</small>
                </div>
            </div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
    
    // Show forecast section with animation
    forecast.classList.remove('d-none');
    forecast.classList.add('fade-in');
}

/**
 * Fetch weather data from API
 * @param {string} city - City name to search for
 */
async function getWeather(city) {
    try {
        showLoading();
        
        // Make API call for current weather and 7-day forecast
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
        );
        
        // Check if API request was successful
        if (!response.ok) {
            throw new Error('City not found. Please check the spelling and try again.');
        }
        
        const data = await response.json();
        
        hideLoading();
        
        // Display the weather data
        displayCurrentWeather(data);
        displayForecast(data);
        
    } catch (err) {
        console.error('Error fetching weather:', err);
        showError(err.message);
    }
}

/**
 * Get user's current location and fetch weather
 */
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        showLoading();
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                try {
                    // Use coordinates to get weather
                    const response = await fetch(
                        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Unable to get weather for your location.');
                    }
                    
                    const data = await response.json();
                    hideLoading();
                    displayCurrentWeather(data);
                    displayForecast(data);
                    
                } catch (err) {
                    showError(err.message);
                }
            },
            // Error callback
            (err) => {
                hideLoading();
                showError('Unable to get your location. Please search for a city manually.');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser.');
    }
}

// Event Listeners

/**
 * Handle form submission (city search)
 */
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    const city = cityInput.value.trim();
    
    // Check if city name is entered
    if (city === '') {
        showError('Please enter a city name.');
        return;
    }
    
    // Fetch weather for the entered city
    getWeather(city);
});

// App Initialization

/**
 * Initialize the app when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    // Try to get weather for user's current location
    getCurrentLocationWeather();
    
    // Set focus on search input for better UX
    cityInput.focus();
});

// Additional features you can add:
// - Save favorite cities to localStorage
// - Add metric/imperial unit toggle
// - Add weather alerts/warnings
// - Add hourly forecast
// - Add weather maps integration