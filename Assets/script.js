const googleApi = ""
const openWeatherApi = "a6c547c031c1288a84cffd617dc39594"
var lat = null;
var long = null;
var currentData = null;
var currentCity = null;
var currentTemp = null;
var currentwind = null;
var currentHumidity = null;
var currentWind = null;
var searchHistroy  = [];
// var searchHistroy = ["Austin, TX, USA", "Chicago, IL, USA", "New York, NY, USA", "Philadelphia, PA, USA"]

function placeSearch(){
    var autocomplete = new google.maps.places.Autocomplete($("#autocomplete")[0]);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        // make array of objects
        lat = place.geometry['location'].lat()
        long = place.geometry['location'].lng();
        currentCity = place.address_components[0].long_name
         var placeObject = {
            cityName: currentCity,
            cityLat: lat,
            cityLong: long
        };
        var newPlace = Object.create(placeObject);
        newPlace.cityName = currentCity;
        newPlace.cityLat =  lat;
        newPlace.cityLong = long;

        searchHistroy.forEach((value,key)=>{
            if (placeObject = searchHistroy[value]){
                searchHistroy.splice(key, 1)
            };
        // console.log(key);
        // console.log(value);

        });
        
        searchHistroy.splice(0,0, newPlace);

        

        if (searchHistroy.length > 5){
            searchHistroy.pop()
        };
        // searchHistroy.set(place.address_components[0].long_name, {lat, long});
    });
};


$("#searchbtn").click(function(){
    
    apiCall(lat, long);
    storeSearch();
    
    

    
});

function apiCall(lat1, long1){
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat1+"&lon="+long1+"&exclude=minutely,hourly&units=imperial&appid=a6c547c031c1288a84cffd617dc39594";
    var thisLat = lat1.toString();
    var thisLong = long1.toString();
    console.log(thisLat)
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        currentData = data;
        getCityNameGecode();
            function getCityNameGecode (lat1, long1){
                var geocodeApi ="https://maps.googleapis.com/maps/api/geocode/json?latlng="+thisLat+","+thisLong+"&key="+googleApi;
               
                fetch(geocodeApi)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    var thisCity = data;
                    var current = thisCity.results[0].address_components[2].short_name;
                    console.log(current);
                    renderData(current);
                    
                })
                
            
            }
        //todo: create function that gets city name off lat and long
        
        renderSearchHistoryButtons();
    });
};

function renderData(locationName){
    var iconUrl = `https://openweathermap.org/img/wn/`;
    var icon = currentData.current.weather[0].icon;
    var iconUrlComplete = iconUrl + icon + "@2x.png";
    var dtn = moment.unix(currentData.current.dt).utc();
    var dtFormated = moment(dtn).format("MM-DD-YYYY");
    currentCity = locationName
    $("#location").text(currentCity);
    $("#date").text(dtFormated);
    $("#currentIcon").attr("src", iconUrlComplete);
    $("#temp").text("Temp: " + currentData.current.temp +String.fromCharCode(176)+"F");
    $("#wind").text("Wind speed: " + currentData.current.wind_speed);
    $("#humidit").text("Humidity: " + currentData.current.humidity);
    $("#uv").text("UV Index: " + currentData.current.uvi);

    // renders 5 day forcast
    $("#fiveDayForcast").empty();
    for(var i=0; i<5; i++){
        var dailyForcast = currentData.daily;
        var fivedaydt =  moment.unix(dailyForcast[i].dt).utc();
        var fivedaydtFormatted = moment(fivedaydt).format("MM-DD-YYYY")
        var fiveDayIcon = dailyForcast[i].weather[0].icon;
        var fiveDayIconURL = iconUrl + fiveDayIcon + "@2x.png";
        var fivedaytemp = dailyForcast[i].temp.day + String.fromCharCode(176)+"F";
        var fivedaywind = dailyForcast[i].wind_speed;
        var fivedayhumidity = dailyForcast[i].humidity;
        var fivedayHtml = 
            $(`<div class="card my-2" style="width: 10rem;">
                <div class="card-body">
                    <h5 id="5ddatei-`+i+`" class="card-title"></h5>
                    <img id="5diconi-`+i+`" class="image w-30 img-thumbnail" src="" alt="weather icon">
                    <p id="5dtempi-`+i+`" class="card-text"></p>
                    <p id="5dwindi-`+i+`" class="card-text"></p>
                    <p id="5dhumidityi-`+i+`" class="card-text"></p>
                </div>
            </div>`)
        $("#fiveDayForcast").append(fivedayHtml);
        $("#5ddatei-"+i).text(fivedaydtFormatted)
        $("#5diconi-"+i).attr("src", fiveDayIconURL);
        $("#5dtempi-"+i).text("Temp: " +fivedaytemp);
        $("#5dwindi-"+i).text("Wind: " +fivedaywind+"mph");
        $("#5dhumidityi-"+i).text("Humidity: " +fivedayhumidity);

    };
};

function init() {
    var storedCities = JSON.parse(localStorage.getItem("storedCities"));
    if (storedCities > 5){
        storedCities.pop()
    };
    if (storedCities !== null) {
        searchHistroy = storedCities;
    };
      

    localStorage.setItem("storedCities", JSON.stringify(searchHistroy));

};

init();

function storeSearch(){
    localStorage.setItem("storedCities", JSON.stringify(searchHistroy));

}

function renderSearchHistoryButtons(){
    var searchHistoryhtml = $("#searchHistoryButtonList");
    searchHistoryhtml.empty();
    var storedCities = JSON.parse(localStorage.getItem("storedCities"));

    storedCities.forEach((value,key)=>{
        var name = searchHistroy[key].cityName;
        var lat = searchHistroy[key].cityLat;
        var long = searchHistroy[key].cityLong;
        // set data latt and long in seperate line

        var searchHistroyButtonsHtml = $(`<button type="button" class="btn my-1 btn-secondary" data-lat=`+lat+` data-long=`+long+` ">`+name+`</button>`)
        searchHistoryhtml.prop("historyButtonEvents", lat.toString());
        $("#searchHistoryButtonList").append(searchHistroyButtonsHtml) 
    });    
};
window.onload = renderSearchHistoryButtons;

function StoreCities() {
    // put a JSON string representation of array searchHistorys into localstorage
    localStorage.setItem("searchHistroy", JSON.stringify(searchHistroy));
};

$("#searchHistoryButtonList").on("click", '.btn', historyButtonEvents);

function historyButtonEvents(event){
    // currentCity = $("#autocomplete").val();
    console.log(event);
    var button = $(event.target);
    var buttonlat = button.attr("data-lat");
    var buttonlong = button.attr("data-long");
    $("#autocomplete").val(button.text()); 
    apiCall(buttonlat, buttonlong);
}


function getLocation() {
    if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess);
        } 
    }

function geoSuccess(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    apiCall(lat, long)
    $("#location").text("Current Location")
    
}
window.onload = getLocation;
