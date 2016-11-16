$(document).ready(function(){
/* Setting Global Variables */
  latitude = null;
  longitude = null;
  weatherdata = null;
  icon = null;
  skycons = null;
  rand = null;
  xml = null;
  date = null;
  var divClone = $(".weathercontent").clone();
/* Event Listeners */
  $('.searchbutton').click(findLatLong);
  $('.locationlist > ul').click(filterList);

/* Functions */

  function findLatLong(event) {
    event.preventDefault();
    locationdata = $('.search').val();
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ locationdata +"&key=AIzaSyBnZE4qJU7UOsB-8_nYTpkJfKOjuCqOm8s", function(data){
      if (data.status ==="ZERO_RESULTS") {
        Materialize.toast('No Results Please Search Again', 4000);
      } else if (data.results.length === 1) {
        latitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;
        $('.weatherlocation').text(data.results[0].formatted_address);


      } else if (data.results.length > 1) {
        $('.locationlist').css('display','inline');
        for (i=0; i <data.results.length; i++) {
          $('.locationlist > ul').append("<li>"+data.results[i].formatted_address+"</li>");
        }
      }
      if (latitude !== null) {
        createWeather(latitude, longitude);
        createMap(latitude, longitude);
      }
    });

    $('.search').val("");
  }

function filterList(event) {
  $('.search').val(event.target.innerText);
  $('.locationlist > ul').empty();
  $('.locationlist').css('display', 'none');

}

function createWeather(latitude, longitude) {
  $.ajax({
  url: 'https://api.darksky.net/forecast/fca786bd2d0d60b933581d4c8abe3203/'+latitude+','+longitude,
  data: "data",
  success: function(data) {
    changeWeatherFields(data);
    pickWord(data.currently.icon);
    selectAndDisplayPoem(rand);
  },
  dataType: "jsonp"
});

}

function createMap (lat,long) {
  $('.mapimage').attr("src","https://maps.googleapis.com/maps/api/staticmap?center="+ lat + "," + long +"&zoom=12&size=600x400&key");
}

function createicon(icon) {
  $('#icon1').css('display', 'block');
  skycons = new Skycons({"color": "black"});
  var allcaps = icon.toUpperCase();
  var final = allcaps.replace(/-/g, "_");
  skycons.add("icon1", Skycons[final]);
  skycons.play();
}

function changeWeatherFields(data) {
  console.log(data);
  $('.weathercontent').replaceWith(divClone.clone());
  $('.temperature').append(' '+data.currently.temperature+ "F");
  $('.currentconditions').append(' '+data.currently.summary);
  $('.daily').append(' '+data.hourly.summary);
  $('.precipprob').append(' '+ (data.currently.precipProbability * 100) +'%');
  //formatTime(data.timezone);
  createicon(data.currently.icon);
}

/* Poem Arrays */
function pickWord(currentWeather){
  currentWeather = currentWeather.toString();
  switch(currentWeather) {
    case "fog":
        array = ["mist", "fog", "fog-road", "murk", "haze", "miasma",];
        break;
    case "clear-day":
        array = ["sun", "clear-day", "bright-morning", "bright-day", "shining", "day", "bright", "brightness", "sunlight", "dawn-to-dusk", "light"];
        break;
    case "clear-night":
        array = [ "night", "dark-night", "clear-night", "dark",  "dusk", "eventide", "nightfall"];
        break;
    case "partly-cloudy-day":
        array = ["cloud", "cloud-day", "overcast", "misty", "sun-cloud", "partly-cloudy-day", "cloud", "overcast", "misty", "smoke", "smog", "cloud-puff", "cloud-burst", "sun-mist"];
        break;
    case "partly-cloudy-night":
        array = ["cloudy", "night", "dark", "overcast", "misty", "evening", "cloud", "overcast", "misty", "cloudy", "smoke", "smog", "puff", "moon-mist", "moon-cloud"];
        break;
    case "cloudy":
        array = ["cloud", "overcast", "misty", "cloudy", "smoke", "smog", "cloud-puff", "mist", "clouds"];
        break;
    case "rain":
        array = ["rain", "raining", "drizzle", "pouring-rain", "misty", "downpour", "torrent", "sprinkling", "deluge", "flood", "monsoon"];
        break;
    case "sleet":
        array = ["sleet", "ice", "cold", "wet", "iceberg"];
        break;
    case "snow":
        array = ["snow", "snowing",  "blizzard"];
        break;
    case "wind":
        array = ["wind", "windy", "breeze", "hurricane"];
        break;
  }
    rand = array[Math.floor(Math.random() * array.length)];
}
function selectAndDisplayPoem(word) {
  $.get('http://www.stands4.com/services/v2/poetry.php?uid=5425&tokenid= yz0jaxfwyLNjBzos&term=' + word, function(data){
    xml = data;
    resultarray = xml.getElementsByTagName('result');
    arr = [].slice.call(resultarray);
    newarr = [];
    for (i=0; i < arr.length; i++) {
      poem = arr[i].getElementsByTagName('poem');
      console.log(poem);
      if (poem[0].textContent.length !== 100) {
        newarr.push(arr[i]);
      }
    }
    selectedPoem = newarr[Math.floor(Math.random() * newarr.length)];
    title = selectedPoem.getElementsByTagName('title');
    poet = selectedPoem.getElementsByTagName('poet');
    poem = selectedPoem.getElementsByTagName('poem');
    console.log(title);
    console.log(poet);
    console.log(poem);
    finaltitle = _.unescape(title[0].textconent);
    finalpoet = _.unescape(title[0].textconent);
    finalpoem = _.unescape(title[0].textconent);
    $('.poemtitle').text(finaltitle);
    $('.poet').text(finalpoet);
    $('.poem').text(finalpoem);
  });
}

//function formatTime(timezone) {
//  var localtime = moment().format();
//  var weathertime = localtime.tz(timezone);
//  console.log(weathertime);
//}
});
