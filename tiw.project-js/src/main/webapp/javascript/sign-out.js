(function(){
    document.getElementById("sign-out").addEventListener("submit", (event) =>{
        event.preventDefault();
        makeCall("POST", "SignOut", null, function (res) {
            if(res.readyState === XMLHttpRequest.DONE){
                let message = res.responseText;
                if(res.status === 200){
                    sessionStorage.removeItem("userName");
                    window.location.href = "../sign-in.html";
                }else{
                    document.getElementById("logout-error").textContent = message;
                }
            }
        });
    });
})();