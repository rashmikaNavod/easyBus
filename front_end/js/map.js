import { getMap } from "./mapLoad.js";

$(document).ready(function(){

    $.ajax({
        url:'http://localhost:8080/api/routes/get_route_list',
        type:"GET",
        success:(res)=>{
            console.log(res);
            let stops = res[0].stops.map(stop=>[stop.longitude,stop.latitude]);
            console.log(stops); 
            showRouteOnMap(stops);
        },
        error:(err)=>{
            console.log(err)
        }
    });

});
    
let map = getMap('map');

function showRouteOnMap(stops) {

    stops.forEach(coord => {
    new mapboxgl.Marker().setLngLat(coord).addTo(map);
    });

    map.addSource("route", 
    {
    type: "geojson",
    data: {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: stops
        }
    }
    }
    );

    map.addLayer(
    {
    id: "route",
    type: "line",
    source: "route",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: { "line-color": "#ff0000", "line-width": 5 }
    }
    );

}






























// map.flyTo({
//     center: stops[0],
//     zoom: 10
// });

// function getCoordinates(place) {
// return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1IjoicmFzaG1pa2EyMDAxIiwiYSI6ImNtNzRlc3B5ZTA0M3YycXF4ZDFibWo3ZnMifQ.kpRdxQECV9GD5fOWKkGJIQ`)
//     .then(response => response.json())
//     .then(data => {
//         let coords = data.features[0].geometry.coordinates;
//         return [coords[0], coords[1]];
//     })
//     .catch(() => [80.7718, 7.8731]); // Default to Sri Lanka if not found
// }