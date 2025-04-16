mapboxgl.accessToken = 'pk.eyJ1IjoicmFzaG1pa2EyMDAxIiwiYSI6ImNtNzRlc3B5ZTA0M3YycXF4ZDFibWo3ZnMifQ.kpRdxQECV9GD5fOWKkGJIQ';
import { getMap } from "./mapLoad.js";
const serverUrl = 'http://localhost:8080';
const notyf = new Notyf();
let routeData = [];
let busNumber;
let busId = null;
let routeId;
let stompClient = null;
let token;
let username;
let selectedLat;
let selectedLng;
let marker = null;
let map;

$(document).ready(()=>{
    connect();
    const role = sessionStorage.getItem("role");
    username = sessionStorage.getItem("username");
    token = sessionStorage.getItem("token");

    $("#u-username").text(username.toLocaleUpperCase());
    if(role === "PASSENGER"){
        $("#u-bus-manage").hide();
        $('#u-kill-engine-btn').prop('disabled', true);
        $('#u-kickstart-btn').prop('disabled', true);
        $('#bus-book-btn').prop('disabled', true);
        $('#bus-book-btn').addClass("opacity-20");
        $('#u-kill-engine-btn').addClass("opacity-20");
        $('#u-kickstart-btn').addClass("opacity-20");
    }

    $.ajax({
        url:'http://localhost:8080/api/v1/route/getAll',
        type:"GET",
        headers:{
            "Authorization": "Bearer "+ token
        },
        success:(res)=>{
            routeData = res.data;
            setupAutocomplete(routeData);
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
        }
    });
    
    function setupAutocomplete(routes){
        $("#userpage-search-bus").autocomplete({
            source: function(req,res){

                let filteredRoutes = routes.filter(route=>{
                    let searchText = (route.startPlace + " to " + route.endPlace + " - " + route.routeNumber).toLowerCase();
                    return searchText.includes(req.term.toLowerCase());
                });

                let autocompleteData = filteredRoutes.map(route => {
                    return {
                        label: route.startPlace + " to " + route.endPlace + " - " + route.routeNumber,
                        value: route.startPlace + " to " + route.endPlace + " - " + route.routeNumber,
                        routeId: route.routeId
                    };
                });

                res(autocompleteData);

            },
            minLength:1,
            select: function(event, ui) {
                $("#userpage-selectedRouteId").val(ui.item.routeId);     
            }
        });
    }

})

$('#send-btn').click(sendMessage);

$("#u-search-bus-btn").on('click',()=>{
    routeId = $("#userpage-selectedRouteId").val();
    $("#userpage-busLocation-details").addClass('hidden');
    $("#userpage-schedule-list-wrapper").removeClass('hidden');
    $("#userpage-schedule-list").empty();
    routeData.forEach(route=>{
        if(route.routeId == routeId){
            route.buses.forEach(bus=>{
                let data = `
                    <div class="p-3 border-2 border-[#a2a2a2] w-fit min-w-[200px]">

                    <h1>Bus Number : <span class="font-semibold">${bus.busNumber}</span> </h1>
                    <h1>Bus Type : <span class="font-semibold">${bus.busType}</span></h1>
                    <h1>Phonenumber : <span class="font-semibold">${bus.phoneNumber}</span></h1>
                    <h1>Current Status : <span class="font-semibold ${bus.startOrOff == "Running" ? 'bg-green-300 px-3 py-[3px] rounded-full':'bg-red-300 px-3 py-[3px] rounded-full' }" >${bus.startOrOff}</span></h1>
                    <button 
                    title="View more" 
                    class="view-more text-purple-500 hover:text-purple-700 text-[20px]" 
                    data-bus-number="${bus.busNumber}" 
                    data-bus-id="${bus.busId}">
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    </div>
                `;
                $("#userpage-schedule-list").append(data);
            });
        }
    });
});

$("#userpage-schedule-list").on('click','.view-more', (e)=>{
    if(busId){
        leaveBus();
    }

    $("#chat-messages").empty();

    busNumber = $(e.currentTarget).data('bus-number');
    busId = $(e.currentTarget).data('bus-id');
    console.log(busNumber);
    $("#userpage-schedule-list-wrapper").addClass('hidden');
    $("#userpage-busLocation-details").removeClass('hidden'); 
    createBusLocationCard(busNumber);

    $('#bus-book-btn').prop('disabled', false);
    $('#bus-book-btn').removeClass("opacity-20");
});

function createBusLocationCard(busNumber){
    routeData.forEach(route=>{
        if(route.routeId == routeId){
            route.buses.forEach(bus=>{
                if(bus.busNumber == busNumber){

                    $("#busNumber").text(busNumber);
                    $("#phonenumber").text(bus.phoneNumber);
                    $("#busType").text(bus.busType);
                    $("#availableSeats").text(bus.seats);

                    if(bus.startOrOff == "Parked"){
                        if(bus.schedules == 0){
                            $("#default-div").removeClass('hidden');
                            $("#scheduleTable").addClass('hidden');
                            $("#loadMap-wrapper").hide();
                            $("#userpage-busLocation-details-main-text").text("No Found schedules");
                        }else{
                            $("#default-div").addClass('hidden');
                            $("#scheduleTable").removeClass('hidden');
                            $("#loadMap-wrapper").hide();
                            createScheduleTable(bus.schedules);
                        }
                    }else if(bus.startOrOff == "Running"){
                        $("#default-div").addClass('hidden');
                        $("#scheduleTable").hide();
                        $("#loadMap-wrapper").show();
                        setMapFunction();
                    }
                    joinBus(bus.busId);

                }
            })
        }
    })
};

function createScheduleTable(scheduleList){
    $("#scheduleTableBody").empty();
    scheduleList.forEach(s=>{
        let row = `
        <tr class="border-b border-[#54656f] hover:bg-gray-50 transition">
            <td class="p-2">${s.startPlace}</td>
            <td class="p-2">${s.startTime}</td>
            <td class="p-2">${s.endPlace}</td>
            <td class="p-2">${s.endTime}</td>
        </tr>
        `;
        $("#scheduleTableBody").append(row);
    });

}

function connect(){
    const socket = new SockJS(serverUrl+'/easy_bus');
    stompClient = Stomp.over(socket);

    stompClient.connect({},function(frame){
        console.log('Connected to WebSocket' + frame);  
    });
}

function joinBus(newBusId) {
    if (!stompClient || !newBusId) return;
    
    if(window.busSubscriptionId){
        stompClient.unsubscribe(window.busSubscriptionId);
        window.busSubscriptionId = null;
    }

    if(window.locationSubscriptionId){
        stompClient.unsubscribe(window.locationSubscriptionId);
        window.locationSubscriptionId = null;
    }

    busId = newBusId;
    
    const busSubscription  = stompClient.subscribe('/topic/bus/' + busId, function(message) {
        console.log(message.body);
        displayMessage(JSON.parse(message.body));
    });
    window.busSubscriptionId  = busSubscription.id;

    const locationSubscription = stompClient.subscribe('/topic/location/' + busId, function(message) {
        console.log("Location update:", message.body);
        updateBusLocation(JSON.parse(message.body));
    });
    window.locationSubscriptionId = locationSubscription.id;

    
    // Send join message to server
    // const joinMessage = {
    //     username: username,
    //     busId: busId
    // };
    
    // stompClient.send('/app/chat.joinBus', {}, JSON.stringify(joinMessage));
    
    // notyf.success("Joined chat for Bus #" + busNumber);
    // console.log("Joined chat for Bus #" + busNumber);
}

function leaveBus(){
    if(!stompClient || !busId) return;
    
    if (!window.subscriptionId) {
        return;
    }

    stompClient.unsubscribe(window.busSubscriptionId);
    window.busSubscriptionId = null;

    stompClient.unsubscribe(window.locationSubscriptionId);
    window.locationSubscriptionId = null;


    // const leaveMessage = {
    //     username: username,
    //     busId: busId
    // };
    
    // stompClient.send('/app/chat.leaveBus', {}, JSON.stringify(leaveMessage));
    
    busId = null;
}

function sendMessage(){
    const content = $('#message-input').val().trim();
    if(content && stompClient && busId){
        const chatMessage = {
            sender: sessionStorage.getItem("username"),
            content: content,
            type: 'TEXT',
            busId:busId
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        $('#message-input').val('');
    }else if(selectedLat && selectedLng && stompClient && busId){
        const busLocation = {
            sender: sessionStorage.getItem("username"),
            lat:selectedLat,
            lng:selectedLng,
            type:'LOCATION_OBJ',
            busId:busId
        };
        stompClient.send('/app/chat.sendLocationObj', {}, JSON.stringify(busLocation));
    }else{
        notyf.error("Select bus to start chat");
    }
}

function displayMessage(message){
    const isMyMessage = message.sender === username;
    const messageClass = isMyMessage ? 'my-message' : 'other-message';

    let messageContent = '';
    if (message.type === 'TEXT') {
        messageContent = `<div class="message-content">${message.content}</div>`;
    }

    const timestamp = message.timestamp ? 
        new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageHtml = `
        <div class="message ${messageClass}">
            <div class="message-sender">${isMyMessage ? 'You' : message.sender}</div>
            <p>${messageContent}</p>
            <div class="message-time">${timestamp}</div>
        </div>
    `;

    $('#chat-messages').append(messageHtml);
    // Scroll to bottom
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.scrollTop = chatContainer.scrollHeight;

}

function updateBusLocation(message){
    if(marker){
        marker.remove();
    }
    const busIcon = createBusIcon();

    marker = new mapboxgl.Marker({ 
        element:busIcon,
        draggable:true
    })
    .setLngLat([message.lng, message.lat])
    .addTo(map);

    marker.on('dragend',function(){
        const lngLat = marker.getLngLat();
        selectedLng = lngLat.lng;
        selectedLat = lngLat.lat;
        console.log("Adjusted coordinates:", selectedLat, selectedLng);
    });
    
    map.flyTo({
        center: [message.lng, message.lat],
        zoom: 15,
        essential: true
    });

}

$("#location-seach-btn").on('click', function(){
    $("#search-container").toggle();
});

function setMapFunction(){
   
    $("#loadMap").empty();
    map = getMap(loadMap);
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
        placeholder: 'Enter bus location'
    });

    $("#search-container").empty();
    document.getElementById('search-container').appendChild(geocoder.onAdd(map));

    geocoder.on('result', function(event) {
        const result = event.result;
        
        selectedLng = result.center[0];
        selectedLat = result.center[1];
        
        if (marker) {
            marker.remove();
        }

        const busIcon = createBusIcon();

        marker = new mapboxgl.Marker({ 
            element:busIcon,
            draggable:true
        })
        .setLngLat([selectedLng, selectedLat])
        .addTo(map);

        marker.on('dragend',function(){
            const lngLat = marker.getLngLat();
            selectedLng = lngLat.lng;
            selectedLat = lngLat.lat;
            console.log("Adjusted coordinates:", selectedLat, selectedLng);
        });
        
        map.flyTo({
            center: [selectedLng, selectedLat],
            zoom: 15,
            essential: true
        });

        
    });
    
}

function createBusIcon() {
    const el = document.createElement('div');
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes simpleBlink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      .simple-blink {
        animation: simpleBlink 0.8s infinite;
      }
    `;
    
    document.head.appendChild(style);
    
    el.innerHTML = `
      <div>
        <img src="../resources/bus.png" width="50" height="50" class="simple-blink">
      </div>
    `;
    
    return el;
}

$("#bus-book-btn").on('click',()=>{
    if(busId){
        window.open(`bookingPage.html?bus_id=${busId}`,"_blank");
    }else{
        $("#btn-pannel-err").text("Please select bus to start booking")
        setTimeout(()=>{
            $("#btn-pannel-err").text("")
        },2000)
    }   
});

// logout
$("#logout-btn").on('click',()=>{
    if (busId) {
        leaveBus();
    }
    sessionStorage.clear();
    window.location.replace("../index.html");
})

$(window).on('beforeunload', function() {
    if (busId) {
        leaveBus();
    }
});

const srollTriggerFun = ()=>{
    let tl = gsap.timeline({
        scrollTrigger:{
            trigger:"#seach-bar-sm",
            scroller:"body",
            start: "top 6%",
            end: "top 6%",
            // markers: true,
            scrub:2,
        }
    });
    
    tl.to("#seach-bar-sm",{
        opacity:0,
    });
}
srollTriggerFun();