jQuery(document).ready(function() {
  var Search = {};

  Search.performSearch = function() {
    var container = $('.st-container');
    container.addClass('st-menu-open');
    container.addClass('st-effect-2');

    Search.searchInput = $("#search-input").val();
    Search.route = "/api/v1/search/markets?zipcode=" + Search.searchInput;
    $.getJSON( Search.route, function(data) {
      var list = $(".listings");
      list.empty();
       if (data[0] === undefined) {
          $(list).append("<li class='no-results'> Nothing Found </li><div class='sad-veggies'></div>)");
          var map = Map.mappy;
          map.setView([ 40.48086, -85.339523 ], 4);
      };
        
      $.each(data, function(index, market){
        if (index == 0) {
          var map = Map.mappy;
          map.setView([ market.address.lat, market.address.long], 11);
        };

        var markerLayer = Map.addMarkerToLayer(market).addTo(Map.mappy);

        markerLayer.eachLayer(function (layer) {
          var content = Map.addPopupToLayer(layer);
          layer.bindPopup(content, {
            closeButton: false });
          layer.on('click', function(e) {
            mappy.setView(e.latlng);
          });
        });

        $(list).append('<li><a class="icon icon-data market-item" data-market-id=' + market.id + '>' + market.name + '<p class="smaller"> <strong>' + market.address.street + '</strong> ' + market.address.city + ', ' + market.address.state + '</p></a></li>');
      });
    });
    Search.addCloseListeners();
  };

  Search.addCloseListeners = function() {
    var container = $('.st-container');
    $(".st-pusher").click(function (e) {
      container.removeClass('st-menu-open');
    });
  };

  $("#search-button").click(function (e) {
    Search.performSearch();
  });

  $("#search-input").keypress(function (e) {
    if (e.keyCode == 13) {
      Search.performSearch();
    };
  });

});

