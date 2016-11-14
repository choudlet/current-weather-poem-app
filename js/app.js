$(document).ready(function(){
  latitude = null;
  longitude = null;
  weatherdata = null;
  $('.searchbutton').click(findLatLong);
  $('.locationlist > ul').click(filterList);

  function findLatLong(event) {
    event.preventDefault();
    locationdata = $('.search').val();
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+ locationdata +"&key=", function(data){
      console.log(data);
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
    console.log(data);
    $('.temperature').append(' '+data.currently.temperature+ "F");
    $('.temperature').append(' '+data.currently.temperature+ "F");
    $('.temperature').append(' '+data.currently.temperature+ "F");
    $('.temperature').append(' '+data.currently.temperature+ "F");
  },
  dataType: "jsonp"
});

}

});
