import { validateMobile, validateText, busNumberPlateRegex, from30To200Regex } from "../util/Validation.js";
const notyf = new Notyf();
let routeData = [];
let scheduleData = [];
let username;
let priceData = [];

$(document).ready(function(){

    username = sessionStorage.getItem("username");
    $("#b-username").text(username.toLocaleUpperCase());
    
    const token = sessionStorage.getItem("token");
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
        $("#busrouteSearch").autocomplete({
            source: function(request, response) {

                let filteredRoutes = routes.filter(route => {
                    let searchText = (route.startPlace + " to " + route.endPlace + " - " + route.routeNumber).toLowerCase();
                    return searchText.includes(request.term.toLowerCase());
                });

                let autocompleteData = filteredRoutes.map(route => {
                    return {
                        label: route.startPlace + " to " + route.endPlace + " - " + route.routeNumber,
                        value: route.startPlace + " to " + route.endPlace + " - " + route.routeNumber,
                        routeId: route.routeId
                    };
                });
                
                response(autocompleteData);
            },
            minLength: 1,
            select: function(event, ui) {
                $("#selectedRouteId").val(ui.item.routeId);
                setStartEndPlace(ui.item.routeId);
            }
        });
    }

})

function setStartEndPlace(data){
    console.log(data);
    routeData.forEach(route=>{
        if(data === route.routeId){
            $("#startplace").html("");
            $("#endplace").html("");
            let data = `
                <option value=${route.startPlace}>${route.startPlace}</option>
                <option value=${route.endPlace}>${route.endPlace}</option>
            `;
            $("#startplace").append(data);
            $("#endplace").append(data);
        }
    });
}

// Animations
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

// Bus Schedule
const busScheduleClearFields = ()=>{
    $("#startplace").val("")
    $("#starttime").val("")
    $("#endplace").val("")
    $("#endtime").val("")
}

$("#addBtn").on('click', ()=>{
    const startPlace = $("#startplace").val()
    const startTime = $("#starttime").val()
    const endPlace = $("#endplace").val()
    const endTime = $("#endtime").val()

    if (!startPlace || !startTime || !endPlace || !endTime) {
        $("#startplace").addClass("border-red-500");
        $("#starttime").addClass("border-red-500");
        $("#endplace").addClass("border-red-500");
        $("#endtime").addClass("border-red-500");
    }else{
        scheduleData.push({
            startPlace:startPlace,
            startTime:startTime,
            endPlace:endPlace,
            endTime:endTime
        });
        updateScheduleTable ();
        busScheduleClearFields();
    }

    setTimeout(()=>{
        $("#startplace").removeClass("border-red-500");
        $("#starttime").removeClass("border-red-500");
        $("#endplace").removeClass("border-red-500");
        $("#endtime").removeClass("border-red-500");
    },2000);
    
});

let updateScheduleTable  = () => {
    const tableBody = $("#scheduleTableBody");
    tableBody.empty();

    scheduleData.forEach((schedule,index)=>{
        tableBody.append(`
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-3">${schedule.startPlace}</td>
                <td class="p-3">${schedule.startTime}</td>
                <td class="p-3">${schedule.endPlace}</td>
                <td class="p-3">${schedule.endTime}</td>
                <td class="p-3 text-center">
                    <button class="remove-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>                
            </tr>    
        `);

    });

};

$("#scheduleTableBody").on('click', '.remove-btn', function(){
    const index = $(this).data("index");
    scheduleData.splice(index, 1);
    updateScheduleTable();
});

// Register Bus
$("#registerBusBtn").on('click', function(){

    let sucess = false;

    let busnumber = $("#busnumber").val().trim();
    let bustype = $("#bustype").val();
    let drivername = $("#drivername").val().trim();
    let busPhonenumber = $("#bus-phonenumber").val().trim();
    let busSeats = $("#bus-seats").val().trim();
    let busRouteId = $("#selectedRouteId").val().trim();
    let busRoute = $("#busrouteSearch").val().trim();

    let topLeftRows = $("#top-left-rows").val().trim();
    let topLeftColums = $("#top-left-colums").val().trim();
    let topRightRows = $("#top-right-rows").val().trim();
    let topRightColums = $("#top-right-colums").val().trim();
    let middleLeftRows = $("#middle-left-rows").val().trim();
    let middleLeftColums = $("#middle-left-colums").val().trim();
    let middleRightRows = $("#middle-right-rows").val().trim();
    let middleRightColums = $("#middle-right-colums").val().trim();
    let bottomRows = $("#bottom-rows").val().trim();
    let bottomColums = $("#bottom-colums").val().trim();    


    if(!busnumber || !bustype || !drivername || !busPhonenumber || !busSeats || !busRoute ||
    !topLeftRows || !topLeftColums || !topRightColums || !topRightRows || !middleLeftColums || !middleLeftRows
    || !middleRightColums || !middleRightRows || !bottomRows || !bottomColums
    ){
        $("#busnumber").addClass("border-red-500");
        $("#bustype").addClass("border-red-500");
        $("#drivername").addClass("border-red-500");
        $("#bus-phonenumber").addClass("border-red-500");
        $("#bus-seats").addClass("border-red-500");
        $("#busrouteSearch").addClass("border-red-500");
        $("#seat-layout-wrapper").addClass("border-red-600");
    }else if(!busNumberPlateRegex(busnumber)){
        $("#busnumber-err").html("Invalid busnumber")
    }else if(!validateText(drivername)){
        $("#drivername-err").html("Invalid Name");
    }else if(!validateMobile(busPhonenumber)){
        $("#bus-phonenumber-err").html("Invalid phonenumber");
    }else if(!from30To200Regex(busSeats)){
        $("#bus-seats-err").html("Invalid seats");
    }else if(!busRouteId){
        $("#busroute-err").html("Select valid route");
    }else{
        sucess = true;
    }

    setTimeout(()=>{
        $("#busnumber").removeClass("border-red-500");
        $("#bustype").removeClass("border-red-500");
        $("#drivername").removeClass("border-red-500");
        $("#bus-phonenumber").removeClass("border-red-500");
        $("#bus-seats").removeClass("border-red-500");
        $("#busrouteSearch").removeClass("border-red-500");
        $("#seat-layout-wrapper").removeClass("border-red-600");
        $("#busnumber-err").html("");
        $("#bustype-err").html("");
        $("#drivername-err").html("");
        $("#bus-phonenumber-err").html("");
        $("#bus-seats-err").html("");
        $("#busroute-err").html("");
        $("#seat-layout-err").html("");
        $("#startplace-err").html("");
        $("#starttime-err").html("");
        $("#endplace-err").html("");
        $("#endtime-err").html("");
    },2000);

    if(sucess){
        if($("#registerBusBtn").text().trim() === "Register"){
            registerBus();
        }else if($("#registerBusBtn").text().trim() === "Update"){

        }
    }

});

const registerBus = ()=>{
    let busnumber = $("#busnumber").val().trim();
    let bustype = $("#bustype").val();
    let drivername = $("#drivername").val().trim();
    let busPhonenumber = $("#bus-phonenumber").val().trim();
    let busSeats = $("#bus-seats").val().trim();
    let busRouteId = $("#selectedRouteId").val().trim();

    let topLeftRows = $("#top-left-rows").val().trim();
    let topLeftColums = $("#top-left-colums").val().trim();
    let topRightRows = $("#top-right-rows").val().trim();
    let topRightColums = $("#top-right-colums").val().trim();
    let middleLeftRows = $("#middle-left-rows").val().trim();
    let middleLeftColums = $("#middle-left-colums").val().trim();
    let middleRightRows = $("#middle-right-rows").val().trim();
    let middleRightColums = $("#middle-right-colums").val().trim();
    let bottomRows = $("#bottom-rows").val().trim();
    let bottomColums = $("#bottom-colums").val().trim(); 
    
    // Format seat data
    const topLeft = `${topLeftRows},${topLeftColums}`;
    const topRight = `${topRightRows},${topRightColums}`;
    const middleLeft = `${middleLeftRows},${middleLeftColums}`;
    const middleRight = `${middleRightRows},${middleRightColums}`;
    const bottom = `${bottomRows},${bottomColums}`;

    const formattedSchedules = scheduleData.map(schedule => {
        return {
            startTime: schedule.startTime,
            startPlace: schedule.startPlace,
            endTime: schedule.endTime,
            endPlace: schedule.endPlace
        };
    });

    const formattedPrices = priceData.map(price=>{
        return{
            startPlace:price.startPlace,
            endPlace:price.endPlace,
            price:price.price
        };
    });
    
    const token = sessionStorage.getItem("token");

    $.ajax({
        url:'http://localhost:8080/api/v1/bus/register',
        type:"POST",
        headers:{
            "Authorization": "Bearer "+ token,
            "Content-Type": "application/json"
        },
        data:JSON.stringify({
            "busNumber": busnumber,
            "busType": bustype,
            "phoneNumber": busPhonenumber,
            "driverName": drivername,
            "seats": parseInt(busSeats),
            "routeId": parseInt(busRouteId),
            "topLeft": topLeft,
            "topRight": topRight,
            "middleLeft": middleLeft,
            "middleRight": middleRight,
            "bottom": bottom,
            "schedules": formattedSchedules,
            "prices":formattedPrices,
            "username":username
        }),
        success:(res)=>{
            notyf.success(res.message);
            resetFormData();
            $("#scheduleTableBody").empty();
            $("#pricesTableBody").empty();
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
            if(xhr.status === 500){
                notyf.error("Server error...Try again later");
            }else{
                notyf.error(xhr.responseJSON.message);
            }
            
        }
    });
    
}

const resetFormData = ()=>{
    $("#busnumber").val("");
    $("#bustype").val("");
    $("#drivername").val("");
    $("#bus-phonenumber").val("");
    $("#bus-seats").val("");
    $("#selectedRouteId").val("");
    $("#busrouteSearch").val("");
    
    // Reset seat data fields
    $("#top-left-rows").val("");
    $("#top-left-colums").val("");
    $("#top-right-rows").val("");
    $("#top-right-colums").val("");
    $("#middle-left-rows").val("");
    $("#middle-left-colums").val("");
    $("#middle-right-rows").val("");
    $("#middle-right-colums").val("");
    $("#bottom-rows").val("");
    $("#bottom-colums").val("");    
}

$("#add-price-btn").on('click', function(){
    const startPlace = $("#price-start-place").val().trim();
    const endPlace = $("#price-end-place").val().trim();
    const price = $("#price-for-seat").val().trim();

    if(!startPlace || !endPlace || !price){
        $("#price-start-place").addClass("border-red-500");
        $("#price-end-place").addClass("border-red-500");
        $("#price-for-seat").addClass("border-red-500");
    }else{
        priceData.push(
            {
                startPlace:startPlace,
                endPlace:endPlace,
                price:price
            }
        );
        updatePriceTable();
        clearPriceInputs();
    }

    setTimeout(()=>{
        $("#price-start-place").removeClass("border-red-500");
        $("#price-end-place").removeClass("border-red-500");
        $("#price-for-seat").removeClass("border-red-500");
    },2000)

})

function clearPriceInputs(){
    $("#price-start-place").val("");
    $("#price-end-place").val("");
    $("#price-for-seat").val("");    
}

function updatePriceTable(){
    const tableBody = $("#pricesTableBody");
    tableBody.empty();  
    priceData.forEach((price,index)=>{
        tableBody.append(`
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-3">${price.startPlace}</td>
                <td class="p-3">${price.endPlace}</td>
                <td class="p-3">${price.price}</td>
                <td class="p-3 text-center">
                    <button class="remove-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>  
            </tr>
            `);
    }) 
}

$("#pricesTableBody").on('click', '.remove-btn',function(){
    const index = $(this).data("index");
    priceData.splice(index,1);
    updatePriceTable();
});


// logout

$("#logout-btn").on('click',()=>{
    sessionStorage.clear();
    window.location.replace("../index.html");
})


// $(".delete-btn").on("click", function() {
//     const index = $(this).data("index");
//     scheduleData.splice(index, 1);
//     updateScheduleTable();
// });
    // $(this).closest("tr").remove();