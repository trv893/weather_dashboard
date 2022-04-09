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

function placeSearch(){
    var autocomplete = new google.maps.places.Autocomplete($("#autocomplete")[0]);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        lat = place.geometry['location'].lat()
        long = place.geometry['location'].lng();
});
};

  $("#searchbtn").click(function() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=minutely,hourly&units=imperial&appid=a6c547c031c1288a84cffd617dc39594";
    currentCity = $("#autocomplete").val();
    console.log(currentCity);
    fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentData = data;
      for (var i=0; i<= data.length; i++){
        console.log(data[i])
      };
    $("#location").text(currentCity)
    $("#temp").text(currentData.current.temp)
    $("#wind").text(currentData.current.wind_speed)
    $("#humidit").text(currentData.current.humidity)
    $("#uv").text(currentData.current.uvi)

    });
  

  })