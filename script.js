var myApi = "6907b40fb3820eb2e59dcdbb6d4519a3";
var searchList = [];
var currentDay = moment().format('l');


// function for current condition
function weatherCondition(city) {

    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${myApi}`;

    $.ajax({
        url: weatherURL,
        method: "get"
    }).then(function(response) {
        
        $("#citySearched").empty();
        
        let iconCode = response.weather[0].icon;
        let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        let currentCity = $(`
            <h2 id="currentCity">
                ${response.name} ${currentDay} <img src="${iconURL}" alt="${response.weather[0].description}" />
            </h2>
            <p>Temperature: ${response.main.temp} °F</p>
            <p>Humidity: ${response.main.humidity}\%</p>
            <p>Wind Speed: ${response.wind.speed} MPH</p>
        `);

        $("#citySearched").append(currentCity);

        // UV index
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myApi}`;

        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);

            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2">${uvIndex}</span>
                </p>
            `);

            $("#citySearched").append(uvIndexP);

            futureCondition(lat, lon);

            if (uvIndex >= 0 && uvIndex <= 5) {
                $("#uvIndexColor").addClass("badge badge-success").css("color", "white");
            } else if (uvIndex >= 6 && uvIndex <= 10) {
                $("#uvIndexColor").addClass("badge badge-warning").css("color", "white");
            } else {
                $("#uvIndexColor").addClass("badge badge-danger").css("color", "white"); 
            };  
        });
    });
}

