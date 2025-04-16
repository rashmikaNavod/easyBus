import { getMap } from "./js/mapLoad.js";

let map = getMap('map2');
let markers=[];
var routeCoordinates = [];

$(document).ready(function(){

    let routeSelect = $('#routeId');
    routeSelect.empty();

    $.ajax({
        url:'http://localhost:8080/api/routes/get_route_list',
        type:"GET",
        success:(res)=>{
            res.forEach(route=>{
                let optionData = `
                    <option value="${route.routeName},${route.id}">${route.routeName}</option>
                `;
                routeSelect.append(optionData);
            })   
        },
        error:(err)=>{
            console.log(err)
        }
    })


});

$('#reset-stops').on('click',()=>{
    markers.forEach(mark=>{mark.remove()});   
});

$('#submit-btn').on('click',function(event){
    event.preventDefault();

    let routeName = $('#routeName').val();
    let startLocation = $('#startLocation').val();
    let endLocation = $('#endLocation').val();
    // let stops = $('#stops').val().split(",").map(stop => stop.trim());
    let stops = routeCoordinates.map(coord=>({
        latitude: coord[1],
        longitude: coord[0]
    }));
    
    $.ajax({
        url:'http://localhost:8080/api/routes/add',
        type:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        data:JSON.stringify({
            "routeName":routeName,
            "startLocation":startLocation,
            "endLocation":endLocation,
            "stops":stops
        }),
        success:()=>{
            alert("success")
        },
        error:(err)=>{
            console.log(err)
        }
    });

});

$('#select-stops').on('click', (e)=>{
    
    e.preventDefault();
    let div = $('#map2');
    div.css("height","400px");

})

const createIcon = ()=>{
    var icon = document.createElement('img');
    icon.src = "../img/icons/pin.png";
    icon.style.width = '40px';
    icon.style.height = '40px';
    return icon;    
}

map.on('click', (e)=>{
    let lat = e.lngLat.lat;
    let lon = e.lngLat.lng; 
    let coord = [lon,lat];
    routeCoordinates.push(coord);

    let mark = new mapboxgl.Marker(
        {
            element: createIcon()
        }
    ).setLngLat([lon,lat]).addTo(map);
    markers.push(mark);

});

const clearBusFields = ()=>{
    $('#busNumber').val("");
    $('#busType').val("");
    $('#seatNumber').val("");
    $('#routeId').val("");
}

$('#submit-bus-btn').on('click',(e)=>{
    e.preventDefault();

    let busNumber = $('#busNumber').val();
    let busType = $('#busType').val();
    let seatNumber = $('#seatNumber').val();
    let routeName = $('#routeId').val();
    let data = routeName.split(",");

    console.log(data[1]);
    
    $.ajax({
        url:'http://localhost:8080/api/buses/add',
        type:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        data:JSON.stringify({
            "busNumber":busNumber,
            "busType":busType,
            "seatNumber":seatNumber,
            "startOrOff":"Off",
            "status":"Active",
            "routeId":data[1]
        }),
        success:()=>{
            alert("success")
        },
        error:(err)=>{
            console.log(err)
        }
    });
    
    clearBusFields();

});


