$(document).ready(function(){
/* Setting Global Variables */
  latitude = null;
  longitude = null;
  weatherdata = null;
  icon = null;
  skycons = null;
  rand = null;
  xml = null;
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

function createicon(icon) {
  $('#icon1').css('display', 'block');
  skycons = new Skycons({"color": "black"});
  var allcaps = icon.toUpperCase();
  var final = allcaps.replace(/-/g, "_");
  skycons.add("icon1", Skycons[final]);
  skycons.play();
}

function changeWeatherFields(data) {
  $('.weathercontent').replaceWith(divClone.clone());
  $('.temperature').append(' '+data.currently.temperature+ "F");
  $('.currentconditions').append(' '+data.currently.summary);
  $('.daily').append(' '+data.hourly.summary);
  $('.precipprob').append(' '+ data.currently.precipProbability +'%');
  formatTime(data.currently.time);
  createicon(data.currently.icon);
}

/* Poem Arrays */
function pickWord(currentWeather){
  currentWeather = currentWeather.toString();
  switch(currentWeather) {
    case "fog":
        array = ["mist", "fog", "murk", "haze"];
        break;
    case "clear-day":
        array = ["sun", "day", "clear"];
        break;
    case "clear-night":
        array = ["clear", "night", "dark", "moon", "star"];
        break;
    case "partly-cloudy-day":
        array = ["cloud", "day", "overcast", "misty"];
        break;
    case "partly-cloudy-night":
        array = ["cloudy", "night", "dark", "overcast", "misty", "evening"];
        break;
    case "cloudy":
        array = ["cloud", "overcast", "misty", "cloudy"];
        break;
    case "rain":
        array = ["rain", "raining", "drizzle", "pouring", "misty"];
        break;
    case "sleet":
        array = ["sleet", "ice", "cold", "wet"];
        break;
    case "snow":
        array = ["snow", "snowing", "misty"];
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
    selectedPoem = resultarray[Math.floor(Math.random() * resultarray.length)];
    console.log(selectedPoem);

  });
}

function formatTime(time) {
  console.log(time);
}
});
