const output = document.getElementById("show-location");
const input = document.getElementById("get-location");


input.addEventListener("click", () => {
    output.innerHTML = "....loading";
    navigator.geolocation.getCurrentPosition(async (params) => {
        try {
            const data = await fetch(`http://api.weatherapi.com/v1/current.json?key=cd45d1432ea5444084073227252807&q=${params.coords.latitude},${params.coords.longitude}&aqi=yes`).then(res => res.json());
            
            // Simple: Just add the icon to your existing text
            output.innerHTML = `
                ${data.location.name}, ${data.location.region}, ${data.location.country}<br>
                <img src="https:${data.current.condition.icon}" alt="weather icon">
                ${data.current.temp_c}°C
            `;
        } catch (error) {
            console.log(error);
        }
    }, (error) => {console.log(error) })

})