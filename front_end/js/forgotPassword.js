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

})