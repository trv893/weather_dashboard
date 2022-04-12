const googleApi = "AIzaSyAsKIQtmJVAigs5WoO2ayvJYAWUpNmU0cM"
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
        console.log(key);
        console.log(value);

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

function apiCall(lat, long){
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=minutely,hourly&units=imperial&appid=a6c547c031c1288a84cffd617dc39594";

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        currentData = data;
        renderData();
        renderSearchHistoryButtons();
    });
};

function renderData(){
    currentCity = $("#autocomplete").val();
    $("#location").text(currentCity);
    $("#temp").text("Temp: " + currentData.current.temp);
    $("#wind").text("Wind speed: " + currentData.current.wind_speed);
    $("#humidit").text("Humidity: " + currentData.current.humidity);
    $("#uv").text("UV Index: " + currentData.current.uvi);
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
        searchHistoryhtml.prop("test", lat.toString());
        $("#searchHistoryButtonList").append(searchHistroyButtonsHtml) 
    });    
};
window.onload = renderSearchHistoryButtons;

function StoreCities() {
    // put a JSON string representation of array searchHistorys into localstorage
    localStorage.setItem("searchHistroy", JSON.stringify(searchHistroy));
};

$("#searchHistoryButtonList").on("click", '.btn', test);

function test(event){
    // currentCity = $("#autocomplete").val();
    console.log(event);
    var button = $(event.target);
    var buttonlat = button.attr("data-lat");
    var buttonlong = button.attr("data-long");
    $("#autocomplete").val(button.text()); 
    apiCall(buttonlat, buttonlong);
}

// var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=23.714224,78.961452&key=AIzaSyAsKIQtmJVAigs5WoO2ayvJYAWUpNmU0cM";

// $.getJSON(geocodingAPI, function (json) {
//     if (json.status == "OK") {
//         //Check result 0
//         var result = json.results[0];
//         //look for locality tag and administrative_area_level_1
//         var city = "";
//         var state = "";
//         for (var i = 0, len = result.address_components.length; i < len; i++) {
//             var ac = result.address_components[i];
//            if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.short_name;
//         }
//         if (state != '') {
//             console.log("Hello to you out there in " + city + ", " + state + "!");
//         }
//     }

// });


  

