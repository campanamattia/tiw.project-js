(function() {
    document.getElementById("sign-in").addEventListener("submit", (event) =>{
        console.log(event.target);
        let form = event.target.closest("form");

        if(form.checkValidity() === true){
            document.getElementById("error").textContent = null;
            
            makeCall("POST", "SignIn", form, function (res) {
                if(res.readyState === XMLHttpRequest.DONE){
                    let message = res.responseText;
                    if(req.status === 200){
                        sessionStorage.setItem("username", message);
                        window.location.href = "WEB-INF/ThePlaylist.html";
                    }else{
                        document.getElementById("error").textContent = message;
                    }
                }
            });
            
        }else{  
            form.reportValidity();
        }
    });
})();