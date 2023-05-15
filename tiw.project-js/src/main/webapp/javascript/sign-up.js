(function() {
	if(sessionStorage.getItem("username") !== null){
		window.location.href = "ThePlaylist.html";
		return;
	}
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
                        switch(req.status){
						case 200: 
	                        sessionStorage.setItem("username", message);
	                        window.location.href = "ThePlaylist.html";
	                        break;
	                    case 403:
							window.sessionStorage.setItem("username",request.getResponseHeader("userName"));
							window.location.href = request.getResponseHeader("location");
							break;
                    	default:
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