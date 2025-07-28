// Select HTML elements for interaction and display
const button = document.getElementById("search-btn");
const input = document.getElementById("search-input");
const city = document.getElementById("city-name");
const local_time = document.getElementById("local-time");
const temp = document.getElementById("temp");

// Function to update the DOM with weather data
async function showData(data) {
    city.innerHTML = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    local_time.innerHTML = data.location.localtime;
    temp.innerHTML = `${data.current.temp_c} °C`;
}

// Event listener for button click
button.addEventListener("click", async () => {
    // Get the city name from input and remove any extra spaces
    const cityInput = input.value.trim();

    // If input is empty, alert the user
    if (!cityInput) {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Show loading message while fetching data
        temp.innerHTML = "Loading...";

        // Fetch weather data from WeatherAPI (using template literal to insert city)
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=cd45d1432ea5444084073227252807&q=${cityInput}&aqi=yes`);

        // If response is not okay (e.g., 404), throw an error
        if (!response.ok) {
            throw new Error("City not found or API error");
        }

        // Convert the response to JSON format
        const data = await response.json();

        // Pass the data to function that updates the HTML
        await showData(data);
    } catch (error) {
        // If any error occurs (network or city not found), show alert
        alert("Error fetching weather data.");
        console.error(error);

        // Optional: clear old or incorrect data from UI
        temp.innerHTML = "N/A";
        city.innerHTML = "-";
        local_time.innerHTML = "-";
    }
});
