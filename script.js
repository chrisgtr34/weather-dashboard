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

// function for future condition
function futureCondition(lat, lon) {

    // THEN I am presented with a 5-day forecast
    var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${myApi}`;

    $.ajax({
        url: futureURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#fiveDay").empty();
        
        for (let i = 1; i < 6; i++) {
            var info = {
                date: response.daily[i].dt,
                icon: response.daily[i].weather[0].icon,
                temp: response.daily[i].temp.day,
                humidity: response.daily[i].humidity
            };

            var date = moment.unix(info.date).format("MM/DD/YYYY");
            var weatherIconURL = `<img src="https://openweathermap.org/img/w/${info.icon}.png" alt="${response.daily[i].weather[0].main}" />`;
            
            var future = $(`
                <div class="pl-3">
                    <div class="card futureCard bg-primary text-light";>
                        <div class="card-body">
                            <h5>${date}</h5>
                            <p>${weatherIconURL}</p>
                            <p>Temp: ${info.temp} °F</p>
                            <p>Humidity: ${info.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

            $("#fiveDay").append(future);
        }
    }); 
}

$("#search").on("click", function(event) {
    event.preventDefault();

    var cityStorage = $("#enterCity").val().trim();
    weatherCondition(cityStorage);
    if (!searchList.includes(cityStorage)) {
        searchList.push(cityStorage);
        var searched = $(`
            <li class="list-group-item">${cityStorage}</li>
            `);
        $("#searchHistory").append(searched);
    };
    
    localStorage.setItem("cityStorage", JSON.stringify(searchList));
});

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
    var listedCity = $(this).text();
    weatherCondition(listedCity);
});

