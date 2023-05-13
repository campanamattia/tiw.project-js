(function() {
    document.getElementById("sign-up").addEventListener("submit", (event) =>{
        console.log(event.target);
        let form = event.target.closest("form");

        if(form.checkValidity() === true){
            document.getElementById("error").textContent = null;

            let userName = from.username.value;
            let password = from.password.value;

            if(userName.length > 50 || password.length > 50){
                document.getElementById("error").textContent = "Username or password too long";
                return;
            }else{
                makeCall("POST", "SignUp", form, function (res) {
                    if(res.readyState === XMLHttpRequest.DONE){
                        let message = req.responseText;
                        if(res.status === 200){
                            sessionStorage.setItem("username", message);
                            window.location.href = "ThePlaylist.html";
                        }else{
                            document.getElementById("error").textContent = message;
                        }
                    }
                });
            }
        }else{  
            form.reportValidity();
        }
    });
})();