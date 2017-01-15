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
    var $sunMoon = $('.sun-moon');
    var $stars = $('.star');
    var $weatherEffect = $('#weather');
    var $weatherIcon = $('#weather-icon');
    var $clouds = $('#clouds');
    var $mist = $('#mist');

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

                //Checking weather conditions
                var weather = response.weather[0].id;
                console.log(weather);
                ilustrateWeather(weather);
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
        var rest;
        if (hourInZone > 23) {
            hourInZone = 0 + (hourInZone - 24);
            return hourInZone;
        } else if (hourInZone < 0) {
            rest = currentTimeWar + hour;
            hourInZone = 24 - rest;
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
            $sunMoon.removeClass("moon");
            $sunMoon.addClass("sun");
            $stars.fadeOut();
        } else {
            $body.removeClass("day");
            $body.addClass("night");
            $sunMoon.removeClass("sun");
            $sunMoon.addClass("moon");
            $stars.fadeIn(1700);
        }
        console.log("sunrise: " + sunriseCity + ", sunset: " + sunsetCity);
    }

    //Adjusting background animation depending on weather conditions

    function ilustrateWeather(weatherID) {
        $weatherIcon.removeClass();
        $weatherEffect.removeClass();
        $clouds.removeClass();
        $body.removeClass('sky_overcast');
        $mist.removeClass('misty');

        if(weatherID >= 200 && weatherID <= 234) { //thunderstorm
            $weatherIcon.addClass("thunderIcon");
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
            }
        } else if(weatherID >= 300 && weatherID <= 321){ //drizzle
            $stars.fadeOut();
            $weatherEffect.addClass("drizzle");
            $weatherIcon.addClass("rainIcon");
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            } else {
                $sunMoon.removeClass("moon");
            }
        } else if(weatherID >= 500 && weatherID <= 531){ //rain
            $stars.fadeOut();
            $weatherIcon.addClass("rainIcon");
            $weatherEffect.addClass("rain");
            $clouds.addClass('clouds-overcast');
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            } else {
                $sunMoon.removeClass("moon");
            }
        } else if(weatherID >= 600 && weatherID <= 622){ //snow
            $stars.fadeOut();
            $weatherEffect.addClass("snow");
            $weatherIcon.addClass("snowIcon");
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            }
        } else if(weatherID >= 701 && weatherID <= 781){ //atmosphere - mist
            $weatherIcon.addClass("mistIcon");
            $mist.addClass('misty');
        } else if(weatherID >= 801 && weatherID <= 804){ // clouds
            switch (weatherID) {
                case 801: //few clouds
                    $clouds.addClass("clouds-few");
                    $weatherIcon.addClass("fewCloudsIcon");
                    break;
                case 802: //scattered clouds
                    $weatherIcon.addClass("fewCloudsIcon");
                    $clouds.addClass("clouds-scattered");
                    break;
                case 803: //broken clouds
                    $clouds.addClass("clouds-broken");
                    $weatherIcon.addClass("cloudyIcon");
                    break;
                case 804: //overcast
                    $weatherIcon.addClass("overcastIcon");
                    if($body.hasClass('day')) {
                        $body.removeClass('day');
                        $sunMoon.removeClass("sun");
                        $body.addClass('sky_overcast');
                    } else {
                        $sunMoon.removeClass("moon");
                    }
                    break;
            }
        } else if(weatherID >= 900 && weatherID <= 962){ //extreme weather

        }
    }

});
