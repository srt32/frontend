jQuery(document).ready(function() {

var mappy = L.mapbox.map("map", "pzula.h69mf89n", { zoomControl: false }).setView([40.52086, -100.679523], 4);
new L.Control.Zoom({ position: 'topright' }).addTo(mappy);

$("#modal").hide();

var marketData = "http://localhost:5555/api/v1/markets.json?address=true";

$.getJSON( marketData, function( data ) {
  $.each(data, function(index, val) {

     var lng =  parseFloat(val.address.long),
     lat =  parseFloat(val.address.lat);

     var name = val.name;
     var id = val.id;

     var markerLayer = L.mapbox.markerLayer({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng , lat]
        },
        properties: {
          market_id: id,
          name: name,
          description: val.address.description,
          street: val.address.street,
          city: val.address.city,
          name: val.name,
          'marker-size': 'small',
          'marker-color': '#9CFF00'
        }
      }).addTo(mappy);

     markerLayer.eachLayer(function (layer) {
      var content =  '<div class="wheat"><img src="assets/wheat.png"/></div> <div class="main-info"><h4 class="namer"><strong>'+ layer.feature.properties.name + '</strong></h4>' + '<p class="addressy">' + layer.feature.properties.street + ', ' + layer.feature.properties.city + '</br>' + '(' +layer.feature.properties.description + ')' + '</div>';
      layer.bindPopup(content, {
        closeButton: false });
      layer.on('click', function(e) {
        mappy.setView(e.latlng);
      });
    });

    var list = $(".listings");
    $.each(data, function(index, val){
        $(list).append('<li><a class="icon icon-data market-item" data-market-id=' + val.id + '>' + val.name + '<p class="smaller">' + '<strong>' + val.address.street + '</strong>' + ', ' + val.address.city + ', ' + val.address.state + '</p>' + '</a></li>');
     });
    });

        $('.market-item').click(function(el){
          var marketId = $(this).data("market-id"),
              url = "http://localhost:5555/api/v1/markets/" + marketId;

          $.getJSON( url, function( market_data ) {
            $.each(market_data, function (i,val) {
              var payment = [];
              for( i = 0; i < market_data[0].payment_types.length; i++) {
                payment.push(val.payment_types[i].name);
              };

              var products = []
              for( i = 0; i < market_data[0].products.length; i++) {
                products.push(val.products[i].name);
                };
          
          debugger;
          var html = '<h3 class="name">' + market_data[0].name + '</h3>' + 
          '<p>' + payment.join(', ') + '</br>' + products + '</p>';
          
          $(".md-content").html(html);
          $("#modal").show();
            $(".modal-close").click(function (e){
                $('#modal').hide();    
            });
          });
        });
        });
      });
    });
