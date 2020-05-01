// http://api.openweathermap.org/data/2.5/weather?lat=-27.3895670&lon=152.9345090&APPID=ea1a86a291a3ac2fb01e340375bd4f7b

//Global weather values
var celciusValues = {
    temp: 17,
    feelslike: "19",
    wind: 7,
    visibility: "4%",
    low: "14",
    high: "19",
};

var fahrenheitValues = {
    temp: 63,
    feelslike: "66",
    wind: 7,
    visibility: "4%",
    low: "57.2",
    high: "66",
};

$(document).ready(function () {

    $("#celcius").click(function () {
        // Button styling
        $("#celcius").css("box-shadow", "inset 0px 0px 2px 0px black");
        $("#celcius").css("background-color", "#D62828");
        $("#celcius").css("color", "white");
        $("#fahrenheit").css("box-shadow", "");
        $("#fahrenheit").css("background-color", "white");
        $("#fahrenheit").css("color", "#D62828");

        //DOM updating
        document.getElementById('temp').innerHTML = celciusValues.temp + "&deg;c";
        document.getElementById('feels-like').innerHTML = celciusValues.feelslike + "&deg;c";
        document.getElementById('wind-speed').innerHTML = celciusValues.wind + " km/h";
        document.getElementById('low').innerHTML = celciusValues.low + "&deg;c";
        document.getElementById('high').innerHTML = celciusValues.high + "&deg;c";
        if (celciusValues.visibility == "N/A") {
            document.getElementById('visibility').innerHTML = celciusValues.visibility;
        } else {
            document.getElementById('visibility').innerHTML = celciusValues.visibility + " km";
        }
    });

    $("#fahrenheit").click(function () {
        // Button styling
        $("#fahrenheit").css("box-shadow", "inset 0px 0px 2px 0px black");
        $("#fahrenheit").css("background-color", "#D62828");
        $("#fahrenheit").css("color", "white");
        $("#celcius").css("box-shadow", "inset 0px 0px 2px 0px white");
        $("#celcius").css("background-color", "white");
        $("#celcius").css("color", "#D62828");

        //DOM updating
        console.log("Yep");
        document.getElementById('temp').innerHTML = fahrenheitValues.temp + "&deg;f";
        document.getElementById('feels-like').innerHTML = fahrenheitValues.feelslike + "&deg;f";
        document.getElementById('wind-speed').innerHTML = fahrenheitValues.wind + " mp/h";
        document.getElementById('low').innerHTML = fahrenheitValues.low + "&deg;f";
        document.getElementById('high').innerHTML = fahrenheitValues.high + "&deg;f";
        if (fahrenheitValues.visibility == "N/A") {
            document.getElementById('visibility').innerHTML = fahrenheitValues.visibility;
        } else {
            document.getElementById('visibility').innerHTML = fahrenheitValues.visibility + " mi";
        }
    });

    $("#refresh-icon").click(function () {
        // Button styling
        $("#refresh-icon").addClass('fa-spin');

        //DOM updating
        document.getElementById('temp').innerHTML = "17";
        document.getElementById('conditions').innerHTML = "Might Rain";
        document.getElementById('feels-like').innerHTML = "19";
        document.getElementById('wind-speed').innerHTML = "7 mph";
        document.getElementById('wind-direction').innerHTML = "SW";
        document.getElementById('low').innerHTML = "14";
        document.getElementById('high').innerHTML = "19";
        document.getElementById('visibility').innerHTML = "4%";
        document.getElementById('rain-radial').innerHTML = "15%";
        document.getElementById('humidity-radial').innerHTML = "41%";
        createHumidityRadialGraph(0, "-");
        createRainRadialGraph(0, "-");
        setTimeout(function () {
            getWeather();
            $("#refresh-icon").removeClass('fa-spin');
        }, 1000);
    });

    // Initial weather call
    getWeather();
});

function getWeather() {
    // Conditions API call
    $.getJSON("https://api.wunderground.com/api/cda005538d324769/conditions/q/autoip.json", function (data) {
        console.log("Weather data");
        console.log(data);

        // Set main DOM elements
        document.getElementById('city').innerHTML = "in " + data.current_observation.display_location.full;
        document.getElementById('temp').innerHTML = data.current_observation.temp_c + "&deg;c";

        // Set extra DOM elements
        document.getElementById('feels-like').innerHTML = data.current_observation.feelslike_c + "&deg;c";
        document.getElementById('wind-speed').innerHTML = data.current_observation.wind_kph + " km/h";
        document.getElementById('wind-direction').innerHTML = data.current_observation.wind_dir;

        // In the event of no visibility values (i.e it's night time)
        if (data.current_observation.visibility_km == "N/A") {
            document.getElementById('visibility').innerHTML = data.current_observation.visibility_km;
        } else {
            document.getElementById('visibility').innerHTML = data.current_observation.visibility_km + " km";
        }

        //Store global celcius values
        celciusValues.temp = data.current_observation.temp_c;
        celciusValues.feelslike = data.current_observation.feelslike_c;
        celciusValues.wind = data.current_observation.wind_kph;
        celciusValues.visibility = data.current_observation.visibility_km;

        //Store global fahrenheit values
        fahrenheitValues.temp = data.current_observation.temp_f;
        fahrenheitValues.feelslike = data.current_observation.feelslike_f;
        fahrenheitValues.wind = data.current_observation.wind_mph;
        fahrenheitValues.visibility = data.current_observation.visibility_mi;

        // Modify humidity value & create radial graph
        var humidityStr = data.current_observation.relative_humidity;
        var humidityInt = parseInt(data.current_observation.relative_humidity.replace(/%/, ""));
        document.getElementById('humidity-radial').innerHTML = "";
        createHumidityRadialGraph(humidityInt, humidityStr);
    });

    // Forecast API call
    $.getJSON("https://api.wunderground.com/api/cda005538d324769/forecast/q/autoip.json", function (data) {
        console.log("Forecast data");
        console.log(data);
        document.getElementById('low').innerHTML = data.forecast.simpleforecast.forecastday[0].low.celsius + "&deg;c";
        document.getElementById('high').innerHTML = data.forecast.simpleforecast.forecastday[0].high.celsius + "&deg;c";
        document.getElementById("condition-img").src = data.forecast.simpleforecast.forecastday[0].icon_url;
        document.getElementById('conditions').innerHTML = data.forecast.simpleforecast.forecastday[0].conditions;

        //Store global celcius values
        celciusValues.low = data.forecast.simpleforecast.forecastday[0].low.celsius;
        celciusValues.high = data.forecast.simpleforecast.forecastday[0].high.celsius;

        //Store global fahrenheit values
        fahrenheitValues.low = data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
        fahrenheitValues.high = data.forecast.simpleforecast.forecastday[0].high.fahrenheit;

        // Modify POP value & create radial graph
        var popStr = data.forecast.txt_forecast.forecastday[0].pop + "%";
        var popInt = parseInt(data.forecast.txt_forecast.forecastday[0].pop);
        document.getElementById('rain-radial').innerHTML = "";
        createRainRadialGraph(popInt, popStr);
    });
}

function createHumidityRadialGraph(humidityInt, humidityStr) {
    var humidity = new RadialProgressChart('.humidity', {
        diameter: 200,
        shadow: { width: 0 },
        max: 100,
        round: true,
        series: [{
            value: humidityInt,
            color: {
                interpolate: ['#FF9F1C', '#FF9F1C'],
                background: '#FF9F1C'
            }
        }],
        center: [humidityStr, "Relative humidity"]
    });
}

function createRainRadialGraph(chanceInt, chanceStr) {
    var rain = new RadialProgressChart('.rain', {
        diameter: 200,
        shadow: { width: 0 },
        max: 100,
        round: true,
        series: [{
            value: chanceInt,
            color: {
                interpolate: ['#2EC4B6', '#2EC4B6'],
                background: '#2EC4B6'
            }
        }],
        center: [chanceStr, "Chance of rain"]
    });
}