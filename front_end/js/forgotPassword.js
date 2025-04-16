import {strongPasswordRegex } from "../util/Validation.js";

const notyf = new Notyf();

$('#next-btn').on('click',function(){

    let email = $("#reset-password-email").val().trim();

    if(!email){
        $("#input-wrapper").addClass("border-red-500");
        setTimeout(()=>{
            $("#input-wrapper").removeClass("border-red-500");
        },2000);
        return;
    }

    $.ajax({
        url:`http://localhost:8080/api/auth/check_mail/${email}`,
        type:"GET",
        success:(res)=>{
            sessionStorage.setItem("email",res.data.email);
            $("#email-box").hide();
            $("#otp-box").addClass("sm:flex");
            $("#otp-send-mail").text(res.data.email);
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
            if(xhr.status === 500){
                notyf.error("Server error...Try again later");
            }else if(xhr.status === 404){
                const message = xhr.responseJSON.message;
                $("#reset-password-email-err").text("Could't find email...");
                setTimeout(()=>{
                    $("#reset-password-email-err").text("");
                },2000);
            }  
        }
    });

});

$("#otp-get-btn").on('click',function(){

    let otp = $("#get-opt").val().trim();
    let email = sessionStorage.getItem("email")
   
    $.ajax({
        url:`http://localhost:8080/api/auth/verify_otp?otp=${otp}&email=${email}`,
        type:"POST",
        success:(res)=>{
            notyf.success(res.message);
            sessionStorage.setItem("otp",otp);
            $("#email-box").hide();
            $("#otp-box").hide();
            $("#password-box").addClass("sm:flex");
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
            if(xhr.status === 500){
                notyf.error("Server error...Try again later");
            }else if(xhr.status === 502){
                const message = xhr.responseJSON.message;
                $("#reset-password-email-err").text(message);
                setTimeout(()=>{
                    $("#reset-password-email-err").text("");
                },2000);
            }  
        }
    });

});

$("#submit-password-btn").on('click',function(){
    let email = sessionStorage.getItem("email");
    let otp = sessionStorage.getItem("otp");
    let password = $("#submit-password").val().trim();

    if(!strongPasswordRegex(password)){
        $("#submit-password-err").html(
            "* At least 1 uppercase<br>" +
            "* 1 lowercase<br>" +
            "* 1 number<br>" +
            "* 1 symbol<br>" +
            "* 8+ characters length"
        );
        setTimeout(()=>{
            $("#submit-password-err").html("")
        },2000);
        return;
    }

    $.ajax({
        url:'http://localhost:8080/api/auth/reset-password',
        type:"POST",
        headers:{"Content-Type": "application/json"},
        data:JSON.stringify({
            "otp":otp,
            "email":email,
            "password":password
        }),
        success:(res)=>{
            notyf.success(res.message);
            if(res.code === 200){
                window.location.href = "../index.html";
            }
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseJSON.message);
            if(xhr.status === 500){
                notyf.error("Server error...Try again later");
            }else if(xhr.status === 400){
                const message = xhr.responseJSON.message;
                if(message.startsWith("Username")){
                    $("#r-username-err").html(message);
                }else{
                    $("#r-email-err").html(message)
                }
            }  
        }
    });


});