const notyf = new Notyf();

$(document).ready(function(){});

const removeClassFromForm = ()=>{
    setTimeout(()=>{
        $("#l-email").removeClass("border-red-500");
        $("#l-password").removeClass("border-red-500");
        $("#l-email-err").html("");
        $("#l-password-err").html("");
    },2500)
}

const clearFileds = ()=>{
    $("#l-email").val("");
    $("#l-password").val("");
}

$("#login-form").submit((e)=>{
    e.preventDefault();
    let success = false;
    const email = $("#l-email").val().trim();
    const password = $("#l-password").val().trim();

    if(!email || !password){
        $("#l-email").addClass("border-red-500");
        $("#l-password").addClass("border-red-500");
    }else{
        success = true;
    }

    removeClassFromForm();

    if(success){

        $.ajax({
            url:'http://localhost:8080/api/auth/login',
            type:"POST",
            headers:{"Content-Type": "application/json"},
            data:JSON.stringify({
                "email":email,
                "password":password
            }),
            success:(res)=>{
                notyf.success(res.message);
                sessionStorage.setItem("token",res.data.token);
                sessionStorage.setItem("role",res.data.role);
                sessionStorage.setItem("username",res.data.username);
                sessionStorage.setItem("email",res.data.email);
                clearFileds();
                if(res.code === 201){
                    window.location.href = "pages/usersPage.html";
                }
            },
            error: (xhr, status, error) => {
                console.log(xhr.responseJSON.message);
                if(xhr.status === 500){
                    notyf.error("Server error...Try again later");
                }else if(xhr.status === 404){
                    const message = xhr.responseJSON.message;
                    if(message.startsWith("User")){
                        $("#l-email-err").html("Could't find your easy Bus Account");
                    }else{
                        notyf.error("Account is Inactive")
                    } 
                }else if(xhr.status === 502){
                    $("#l-password-err").html("Wrong password. Try again or click Forgot password to reset it.");
                } 
            }
       }); 
    }

});