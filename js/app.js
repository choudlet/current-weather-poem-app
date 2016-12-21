$(document).ready(function() {
    /* Setting Global Variables */
    latitude = null;
    longitude = null;
    locationname = null;
    weatherdata = null;
    icon = null;
    skycons = null;
    rand = null;
    xml = null;
    date = null;
    newarr = null;
    timezone = null;
    var divClone = $(".weathercontent").clone();
    /* Event Listeners */
    $('.searchbutton').click(findLatLong);
    $('.locationlist > ul').click(filterList);
    $('#modal1').modal();
    $('#modal2').modal();
    $('.scrollspy').scrollSpy();
    $('.newpoem').click(resetPoem);
    $('.authorwiki').click(openWiki);

    /* Functions */

    function findLatLong(event) {
        event.preventDefault();
        locationdata = $('.search').val();
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + locationdata + "&key=AIzaSyBnZE4qJU7UOsB-8_nYTpkJfKOjuCqOm8s", function(data) {
            if (data.status === "ZERO_RESULTS") {
                Materialize.toast('No Results Please Search Again', 4000);
            } else if (data.results.length === 1) {
                latitude = data.results[0].geometry.location.lat;
                longitude = data.results[0].geometry.location.lng;
                locationname = data.results[0].formatted_address;
                $('.maincontent').css('display', 'inline');
                $('#scroll').trigger("click");
            } else if (data.results.length > 1) {
                $('.locationlist').css('display', 'inline');
                for (i = 0; i < data.results.length; i++) {
                    $('.locationlist > ul').append("<li>" + data.results[i].formatted_address + "</li>");
                }
            }
            if (latitude !== null) {
                createWeather(latitude, longitude);
                createMap(latitude, longitude);
            }
        });

        $('.search').val("");
    }


    function openWiki(event) {
        window.open('https://en.wikipedia.org/wiki/' + poet[0].innerHTML, '_blank');
    }

    function filterList(event) {
        $('.search').val(event.target.innerText);
        $('.locationlist > ul').empty();
        $('.locationlist').css('display', 'none');

    }

    function createWeather(latitude, longitude) {
        $.ajax({
            url: 'https://api.darksky.net/forecast/fca786bd2d0d60b933581d4c8abe3203/' + latitude + ',' + longitude,
            data: "data",
            success: function(data) {
                weatherdata = data.currently.icon;
                changeWeatherFields(data);
                pickWord(data.currently.icon);
                selectAndDisplayPoem(rand);
            },
            dataType: "jsonp"
        });

    }

    function createMap(lat, long) {
        $('.mapimage').attr("src", "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + long + "&zoom=12&size=400x250&key=AIzaSyDvgn2NkY9SJE6YSn_3LP_7yYvxuUsTmoo");
    }

    function createicon(icon) {
        $('#icon1').css('display', 'block');
        skycons = new Skycons({
            "color": "#484849"
        });
        var allcaps = icon.toUpperCase();
        var final = allcaps.replace(/-/g, "_");
        skycons.add("icon1", Skycons[final]);
        skycons.play();
    }

    function changeWeatherFields(data) {
        timezone = data.timezone;
        $('.weathercontent').replaceWith(divClone.clone());
        $('.locationname').append(locationname);
        $('.temperature').append(' ' + data.currently.temperature + "F");
        $('.currentconditions').append(' ' + data.currently.summary);
        $('.daily').append(' ' + data.hourly.summary);
        $('.precipprob').append(' ' + (data.currently.precipProbability * 100) + '%');
        $('.windspeed').append(' ' + data.currently.windSpeed + ' mph');
        createicon(data.currently.icon);
        formatTime(timezone);
    }

    /* Poem Arrays */
    function pickWord(currentWeather) {
        currentWeather = currentWeather.toString();
        switch (currentWeather) {
            case "fog":
                array = ["mist", "fog", "fog-road", "murk", "haze", "miasma", ];
                break;
            case "clear-day":
                array = ["sun", "clear-day", "bright-morning", "bright-day", "shining", "day", "bright", "brightness", "sunlight", "dawn-to-dusk", "light"];
                break;
            case "clear-night":
                array = ["night", "dark-night", "clear-night", "dark", "dusk", "eventide", "nightfall"];
                break;
            case "partly-cloudy-day":
                array = ["cloud", "cloud-day", "overcast", "misty", "sun-cloud", "partly-cloudy-day", "cloud", "overcast", "misty", "smoke", "cloud-puff", "cloud-burst", "sun-mist"];
                break;
            case "partly-cloudy-night":
                array = ["cloudy", "night", "dark", "overcast", "misty", "evening", "cloud", "overcast", "misty", "cloudy", "smoke", "puff", "moon-mist", "moon-cloud"];
                break;
            case "cloudy":
                array = ["cloud", "overcast", "misty", "cloudy", "smoke", "cloud-puff", "mist", "clouds"];
                break;
            case "rain":
                array = ["rain", "raining", "drizzle", "pouring-rain", "misty", "downpour", "torrent", "sprinkling", "deluge", "flood", "monsoon"];
                break;
            case "sleet":
                array = ["sleet", "ice", "cold", "wet", "iceberg"];
                break;
            case "snow":
                array = ["snow", "snowing", "blizzard"];
                break;
            case "wind":
                array = ["wind", "windy", "breeze", "hurricane"];
                break;
        }
        rand = array[Math.floor(Math.random() * array.length)];
    }

    function selectAndDisplayPoem(word) {
        $.get(`http://localhost:3000/?word=${word}`, function(data) {
          console.log(data);
            title = _.unescape(data.title[0]);
            poet = _.unescape(data.poet[0]);
            poem = _.unescape(data.poem[0]);
            $('.poemtitle').text(title);
            $('.poet').text(poet);
            $('.poem').text(poem);
        });
    }

    function formatTime(timezone) {
        var localtime = moment();
        var weathertime = localtime.tz(timezone).format('hh:mm z');
        $('.localtime').append(' ' + weathertime);
    }

    function resetPoem() {
        pickWord(weatherdata);
        selectAndDisplayPoem(rand);
    }

});
