const notyf = new Notyf();
let token;
let username;
let role;
let routeData = [];
let today;
let busId;

$(document).ready(function(){
    role = sessionStorage.getItem("role");
    username = sessionStorage.getItem("username");
    token = sessionStorage.getItem("token");
    if(role === "PASSENGER"){
        $("#u-bus-manage").hide();
    }
    $("#u-username").text(username.toLocaleUpperCase());
    today = new Date();
    $("#now-data").text(today.toISOString().split('T')[0]);
    const urlParams = new URLSearchParams(window.location.search);
    busId = urlParams.get('bus_id');
    console.log(busId);

    let bottom_row = 1;
    let bottom_colum = 6;
    
});

$("#search-date-btn").on('click',()=>{
    let date = $("#search-date").val();

    if(!date){
        notyf.error("Enter date")
    }else{
        
    }

});













// logout
$("#logout-btn").on('click',()=>{
    sessionStorage.clear();
    window.location.replace("../index.html");
})

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