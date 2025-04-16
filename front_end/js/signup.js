import {validateMobile, strongPasswordRegex, usernameRegex, strictFullNameRegex } from "../util/Validation.js";
const notyf = new Notyf();
$(document).ready(function(){})

const removeClassFromForm = ()=>{
    setTimeout(()=>{
        $("#r-fullname").removeClass("border-red-500");
        $("#r-username").removeClass("border-red-500");
        $("#r-password").removeClass("border-red-500");
        $("#r-number").removeClass("border-red-500");
        $("#r-email").removeClass("border-red-500");
        $("#r-whoareyou").removeClass("border-red-500");
        $("#r-checkBox-err").html("");
        $("#r-number-err").html("");
        $("#r-password-err").html("");
        $("#r-username-err").html("");
        $("#r-fullname-err").html("");
        $("#r-email-err").html("")
    },2500)
}

const clearFileds = ()=>{
    $("#r-fullname").val("");
    $("#r-username").val("");
    $("#r-password").val("");
    $("#r-number").val("");
    $("#r-email").val("");
    $("#r-whoareyou").val("");
    $('input[type="checkbox"]').prop('checked', false);
}

$("#register-form").submit((e)=>{
    e.preventDefault();

    let sucess = false;

    const fullname = $("#r-fullname").val().trim();
    const userName = $("#r-username").val().trim().toLowerCase();
    const password = $("#r-password").val().trim();
    const phoneNumber = $("#r-number").val().trim();
    const email = $("#r-email").val().trim();
    const whoareyou = $("#r-whoareyou").val();

    if(!fullname || !userName || !password || !phoneNumber || !email || !whoareyou){
        $("#r-fullname").addClass("border-red-500");
        $("#r-username").addClass("border-red-500");
        $("#r-password").addClass("border-red-500");
        $("#r-number").addClass("border-red-500");
        $("#r-email").addClass("border-red-500");
        $("#r-whoareyou").addClass("border-red-500");

    }else if(!$('input[type="checkbox"]').is(':checked')){
        $("#r-checkBox-err").html("Please accept the easy Bus Terms of Service before continuing");
    }else if(!validateMobile(phoneNumber)){
        $("#r-number-err").html("Invalid Mobile number");
    }else if(!strongPasswordRegex(password)){
        $("#r-password-err").html(
            "* At least 1 uppercase<br>" +
            "* 1 lowercase<br>" +
            "* 1 number<br>" +
            "* 1 symbol<br>" +
            "* 8+ characters length"
          );
    }else if(!usernameRegex(userName)){
        $("#r-username-err").html(
            "Invalid username<br>" +
            "EX-(user123 or user_name)"
        );
    }else if(!strictFullNameRegex(fullname)){
        $("#r-fullname-err").html(
            "Invalid name<br>" +
            "EX- Rashmika Navod"
        );
    }else{
        sucess = true;
    }

    removeClassFromForm();

    if(sucess){

       $.ajax({
            url:'http://localhost:8080/api/auth/register',
            type:"POST",
            headers:{"Content-Type": "application/json"},
            data:JSON.stringify({
                "fullName":fullname,
                "username":userName,
                "email":email,
                "password":password,
                "role": whoareyou,
                "phoneNumber":phoneNumber
            }),
            success:(res)=>{
                notyf.success(res.message);
                sessionStorage.setItem("username",userName);
                sessionStorage.setItem("role",whoareyou);
                sessionStorage.setItem("token",res.data.token);
                clearFileds();
                if(res.code === 201){
                    window.location.href = "usersPage.html";
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
                    removeClassFromForm();
                }  
            }
       }); 

    }

});