import { validateRouteNumber, validateText } from "../util/Validation.js";
let routeId;
const notyf = new Notyf();

$(document).ready(function(){
    loadRouteData();
})

var routeDetails = [];

const loadRouteData = ()=>{
    routeDetails.length = 0;
    $.ajax({
        url:'http://localhost:8080/api/v1/route/getAll',
        type:"GET",
        success:(res)=>{
            routeDetails = res.data;
            buildTable(routeDetails);
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
            $("#routeTableBody").html(`<tr><td colspan="5" class="font-semibold text-sm text-[#585858] text-center h-[150px]">No Data found</td></tr>`);
        }
    });
}

let resetRouteData = ()=>{
    $("#routenumber").val("")
    $("#endplace").val("")
    $("#startplace").val("")
}

let setTimeForValidation = ()=>{
    setTimeout(()=>{
        $("#routenumber").removeClass("border-red-500");
        $("#endplace").removeClass("border-red-500");
        $("#startplace").removeClass("border-red-500");
        $("#routenumber-err").html("");
        $("#endplace-err").html("");
        $("#startplace-err").html("");
    },2000)
}

$("#route-seach").on('keyup', function(){
    var value = $(this).val().toLowerCase();
    let data = searchRoute(value,routeDetails)
    buildTable(data);
})

function searchRoute(value,data){
    return data.filter(route => 
        String(route.routeNumber).includes(value) || 
        route.startPlace.toLowerCase().includes(value) || 
        route.endPlace.toLowerCase().includes(value)
    );     
}

function buildTable(data){

    $("#routeTableBody").html("")

    data.forEach((route)=>{
        let row = `
            <tr class="border-b border-[#54656f] hover:bg-gray-50 transition">
                <td class="p-2">${route.routeId}</td>
                <td class="p-2">${route.routeNumber}</td>
                <td class="p-2">${route.startPlace}</td>
                <td class="p-2">${route.endPlace}</td>
                <td class="p-2 text-center">
                    <button title="Update" class="update-btn text-yellow-500 hover:text-yellow-700">
                        <i class="fa-solid fa-wrench text-[22px]"></i>
                    </button>                    
                </td>
            </tr>
        `;
        $("#routeTableBody").append(row);
    });

}

$("#routeTableBody").on('click', '.update-btn', function(){
    $("#route-main-btn").html("Update"); // Button text change

    var row = $(this).closest("tr"); 

    routeId = row.find("td:eq(0)").text().trim();
    var routeNumber = row.find("td:eq(1)").text().trim();
    var startPlace = row.find("td:eq(2)").text().trim();
    var endPlace = row.find("td:eq(3)").text().trim();

    $("#routenumber").val(routeNumber);
    $("#startplace").val(startPlace);
    $("#endplace").val(endPlace);
})

$("#route-main-btn").on('click',function(){

    if($("#route-main-btn").text().trim() === "Create"){
        let success = false;

        let routenumber = $("#routenumber").val().trim();
        let endplace = $("#endplace").val().trim();
        let startplace = $("#startplace").val().trim();
        
        if (endplace.length === 0 || startplace.length === 0 || routenumber.length === 0) {
            $("#routenumber").addClass("border-red-500");
            $("#endplace").addClass("border-red-500");
            $("#startplace").addClass("border-red-500");
        }else if (!validateRouteNumber(routenumber)){
            $("#routenumber-err").html("Invalid route number");
        }else if(!validateText(endplace)){
            $("#endplace-err").html("Invalid text");
        }else if(!validateText(startplace)){
            $("#startplace-err").html("Invalid text");
        }else{
            success = true;
        }

        setTimeForValidation();

        if(success){
            $.ajax({
                url:'http://localhost:8080/api/v1/route/create',
                type:"POST",
                headers:{"Content-Type": "application/json"},
                data:JSON.stringify({
                    "routeNumber":routenumber,
                    "startPlace":startplace,
                    "endPlace":endplace
                }),
                success:(res)=>{
                    notyf.success(res.message);
                    loadRouteData();
                    resetRouteData();
                },
                error:(xhr, status, error)=>{
                    notyf.error("Failure to action");
                    console.log(xhr.responseJSON.message);
                }
    
            });            
        }


    }else if($("#route-main-btn").text().trim() === "Update"){
        let success = false;

        let routenumber = $("#routenumber").val().trim();
        let endplace = $("#endplace").val().trim();
        let startplace = $("#startplace").val().trim();

        if (endplace.length === 0 || startplace.length === 0 || routenumber.length === 0) {
            $("#routenumber").addClass("border-red-500");
            $("#endplace").addClass("border-red-500");
            $("#startplace").addClass("border-red-500");
        }else if (!validateRouteNumber(routenumber)){
            $("#routenumber-err").html("Invalid route number");
        }else if(!validateText(endplace)){
            $("#endplace-err").html("Invalid text");
        }else if(!validateText(startplace)){
            $("#startplace-err").html("Invalid text");
        }else{
            success = true;
        }

        setTimeForValidation();

        if(success){
            $.ajax({
                url:'http://localhost:8080/api/v1/route/update',
                type:"PUT",
                headers:{"Content-Type": "application/json"},
                data:JSON.stringify({
                    "routeId":routeId,
                    "routeNumber":routenumber,
                    "startPlace":startplace,
                    "endPlace":endplace
                }),
                success:(res)=>{
                    notyf.success(res.message);
                    loadRouteData();
                    resetRouteData();
                    $("#route-main-btn").html("Create");
                },
                error:(xhr, status, error)=>{
                    notyf.error("Failure to action");
                    console.log(xhr.responseJSON.message);
                }
    
            });             
        }

        

    }

});
