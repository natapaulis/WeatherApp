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
    var $extreme = $('#extreme');

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

                //Adding weather description
                $descriptionToShow = $("<p class='weather-description'>").text(response.weather[0].description);
                $descriptionField.replaceWith($descriptionToShow);

                //Checking time in a search city based on longitude
                var longitude = response.coord.lon;
                var $timeInCity = timeZone(longitude);
                console.log("Approximate time in a searched city: " + $timeInCity);

                // Checking time in unix and converting it to readable time. Then depending if it is after sunrise or after sunset changing the background for day or night
                var sunset = response.sys.sunset;
                var sunrise = response.sys.sunrise;
                var timeOfSunset = convertUnix(sunset);
                var timeOfSunrise = convertUnix(sunrise);
                sunsetSunrise(longitude, $timeInCity, timeOfSunrise, timeOfSunset);

                //Checking weather conditions and illustrating the weather
                var weather = response.weather[0].id;
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
        return hours;
    }

    //Function to change background depending whether it is day or night
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

        //Changing background for day and night
        if(time >= sunriseCity && time <= sunsetCity) {
            $body.removeClass("night");
            $body.addClass("day");
            $sunMoon.removeClass("moon");
            $sunMoon.addClass("sun");
        } else {
            $body.removeClass("day");
            $body.addClass("night");
            $sunMoon.removeClass("sun");
            $sunMoon.addClass("moon");
        }
        console.log("sunrise: " + sunriseCity + ", sunset: " + sunsetCity);
    }

    //Function to adjust background animation depending on weather conditions

    function ilustrateWeather(weatherID) {
        $weatherIcon.removeClass();
        $weatherEffect.removeClass();
        $clouds.removeClass();
        $extreme.removeClass();
        $body.removeClass('sky_overcast');
        $body.removeClass('sky_overcast_night');
        $mist.removeClass('misty');
        $stars.fadeOut();

        if(weatherID >= 200 && weatherID <= 234) { //thunderstorm
            $weatherIcon.addClass("thunderIcon");
            $extreme.addClass('thunder');
            $weatherEffect.addClass('thunder_rain')
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
            } else {
                $body.removeClass('night');
                $sunMoon.removeClass("moon");
                $body.addClass('sky_overcast_night');
            }
        } else if(weatherID >= 300 && weatherID <= 321){ //drizzle
            $weatherIcon.addClass("rainIcon");
            $weatherEffect.addClass("drizzle");
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            } else {
                $body.removeClass('night');
                $sunMoon.removeClass("moon");
                $body.addClass('sky_overcast_night');
            }
        } else if(weatherID >= 500 && weatherID <= 531){ //rain
            $weatherIcon.addClass("rainIcon");
            $weatherEffect.addClass("rain");
            $clouds.addClass('clouds-overcast');
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            } else {
                $body.removeClass('night');
                $sunMoon.removeClass("moon");
                $body.addClass('sky_overcast_night');
            }
        } else if(weatherID >= 600 && weatherID <= 622){ //snow
            $weatherIcon.addClass("snowIcon");
            $weatherEffect.addClass("snow");
            if($body.hasClass('day')) {
                $body.removeClass('day');
                $body.addClass('sky_overcast');
                $sunMoon.removeClass("sun");
            } else {
                $body.removeClass('night');
                $sunMoon.removeClass("moon");
                $body.addClass('sky_overcast_night');
            }
        } else if(weatherID >= 701 && weatherID <= 781){ //atmosphere - mist
            $weatherIcon.addClass("mistIcon");
            $mist.addClass('misty');
            if($body.hasClass('night')) {
                $stars.fadeIn(1700);
            }
        } else if(weatherID === 800) {
            if($body.hasClass('night')) {
                $stars.fadeIn(1700);
            }
        } else if(weatherID >= 801 && weatherID <= 804){ // clouds
            switch (weatherID) {
                case 801: //few clouds
                    $weatherIcon.addClass("fewCloudsIcon");
                    $clouds.addClass("clouds-few");
                    if($body.hasClass('night')) {
                        $stars.fadeIn(1700);
                    }
                    break;
                case 802: //scattered clouds
                    $weatherIcon.addClass("fewCloudsIcon");
                    $clouds.addClass("clouds-scattered");
                    if($body.hasClass('night')) {
                        $stars.fadeIn(1700);
                    }
                    break;
                case 803: //broken clouds
                    $weatherIcon.addClass("cloudyIcon");
                    $clouds.addClass("clouds-broken");
                    if($body.hasClass('night')) {
                        $stars.fadeIn(1700);
                    }
                    break;
                case 804: //overcast
                    $weatherIcon.addClass("overcastIcon");
                    $clouds.addClass('clouds-overcast');
                    if($body.hasClass('day')) {
                        $body.removeClass('day');
                        $sunMoon.removeClass("sun");
                        $body.addClass('sky_overcast');
                    } else {
                        $body.removeClass('night');
                        $sunMoon.removeClass("moon");
                        $body.addClass('sky_overcast_night');
                    }
                    break;
            }
        } else if(weatherID >= 900 && weatherID <= 962) { //extreme weather
            if (weatherID >= 952 && weatherID <= 957 || weatherID == 905) { //windy/breeze
                $weatherIcon.addClass("windIcon");
                $extreme.addClass('windy');
                if($body.hasClass('night')) {
                    $stars.fadeIn(1700);
                }
            } else if(weatherID == 906) { //hail
                $weatherIcon.addClass("snowIcon");
                $weatherEffect.addClass("hail");
                $clouds.addClass('clouds-overcast');
                if($body.hasClass('day')) {
                    $body.removeClass('day');
                    $body.addClass('sky_overcast');
                    $sunMoon.removeClass("sun");
                } else {
                    $body.removeClass('night');
                    $sunMoon.removeClass("moon");
                    $body.addClass('sky_overcast_night');
                }
            } else if (weatherID >= 900 && weatherID <= 902 || weatherID >= 958) { //tornado/hurricane/gale
                $weatherIcon.addClass("windIcon");
                $clouds.addClass('clouds-overcast');
                $weatherEffect.addClass("rain");
                $extreme.addClass('tornado');
                if($body.hasClass('day')) {
                    $body.removeClass('day');
                    $body.addClass('sky_overcast');
                    $sunMoon.removeClass("sun");
                } else {
                    $body.removeClass('night');
                    $sunMoon.removeClass("moon");
                    $body.addClass('sky_overcast_night');
                }
            }

        }

    }

});
