var myApi = "6907b40fb3820eb2e59dcdbb6d4519a3";
var searchList = [];
var currentDay = moment().format('l');


// function for current condition
function weatherCondition(city) {

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${myApi}`;

    $.ajax({
        url: apiURL,
        method: "get"
    }).then(function(response) {
