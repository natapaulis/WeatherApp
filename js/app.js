$(document).ready(function(){
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=c85501c8cd41a23e007c0b2b14c3edc2&units=metric&q=';
    var $body = $(".main-body");
    var $name = $(".main-name");
    var $searchBtn = $(".search-btn");
    var $searchField = $(".search-field");
    var $tempField = $(".weather-info");
    var $descriptionField = $(".weather-description");
    var $letters = $name.find("span");
    var $form = $('form');
    var $textToSearch;
    var $sunPosition = $(".day-time");
    var $temp;
    var $tempToShow;

    function showSearch() {
        $searchBtn.on('click', function() {
            $searchField.animate({
                width: "toggle"
            }, 800);
        });
    }

    showSearch();


    function searchCity() {
        $form.on('submit', function(e){
            e.preventDefault();
            $textToSearch = $searchField.val();
            $name = $(".main-name");
            $tempField = $(".weather-info");
            $descriptionField = $(".weather-description");

            $.ajax({
                url: weatherURL + $textToSearch
            }).done(function(response){
                //hiding search field after the text is submitted
                $searchField.toggle();

                //Putting name of the checked city and country as a main text
                var $cityName = $("<div class='main-name city-name'>").text(response.name + ", " + response.sys.country);
                $name.replaceWith($cityName);

                //Adding Temperature
                $temp = response.main.temp;
                $tempToShow = $("<div class='weather-info'>").text($temp.toFixed(1) + " C");
                $tempField.replaceWith($tempToShow);

                //Add weather description
                $descriptionToShow = $("<p class='weather-description'>").text(response.weather[0].description);
                $descriptionField.replaceWith($descriptionToShow);

                //check time in search city based on longitude
                var latitude = response.coord.lat;
                var longitude = response.coord.lon;
                var $timeInCity = timeZone(longitude);
                console.log($timeInCity);

                // checking time in unix and converting it to readable time. Then depending if it is after sunrise or after sunset changing the background for day or night
                var sunset = response.sys.sunset;
                var sunrise = response.sys.sunrise;
                var timeOfSunset = convertUnix(sunset);
                var timeOfSunrise = convertUnix(sunrise);
                sunsetSunrise(longitude, $timeInCity, timeOfSunrise, timeOfSunset);

            }).fail(function(error){
                console.log(error);
            });
        })
    }
    searchCity();


    // Function to check time in searched city
    function timeZone(long) {
        var time = Math.floor(long / 15);
        var date = new Date();
        var currentTimeWar = date.getHours();
        var hourInZone = currentTimeWar + time;
        if (hourInZone > 23) {
            hourInZone = 0 + (hourInZone - 24);
            return hourInZone;
        } else {
            return hourInZone;
        }
    }


    //Function to change timestamp to readable hour - hour shows time for GMT-0
    function convertUnix(timestamp) {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        // var minutes = "0" + date.getMinutes();
        var formattedTime = hours;
        return formattedTime;
    }

    //Function to change background depending whether it is time before or after sunrise
    function sunsetSunrise(longitude, time, sunrise, sunset) {
        //Since time is in Unix, we need to check the time of sunrise/sunset in local time
        var hour = Math.floor(longitude / 15);
        var sunsetCity = sunset + hour;
        var sunriseCity = sunrise + hour;
        var rest;

        //checking if the counted time is more bigger than 23 or smaller than 0, to adjust the time to correct format
        if (sunsetCity > 23) {
            sunsetCity = 0 + (sunsetCity - 24);
        } else if (sunsetCity < 0) {
            rest = sunrise + hour;
            sunsetCity = 24 - rest;
        }

        if (sunriseCity > 23) {
            sunriseCity = 0 + (sunriseCity - 24);
        } else if (sunriseCity < 0) {
            rest = sunrise + hour;
            sunriseCity = 24 - rest;
        }

        //Changing background by adding/removing class
        if(time >= sunriseCity && time <= sunsetCity) {
            $body.removeClass("night");
            $body.addClass("day");
        } else {
            $body.removeClass("day");
            $body.addClass("night");
        }
        console.log("sunrise: " + sunriseCity + ", sunset: " + sunsetCity);
    }
});
