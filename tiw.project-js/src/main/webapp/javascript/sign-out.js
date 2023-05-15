(function(){
    document.getElementById("sign-out").onclick = function(){
        makeCall("POST", 'SignOut', null, function (res) {
            if(res.readyState === XMLHttpRequest.DONE){
                let message = res.responseText;
                switch(res.status){
					case 200:
	                    sessionStorage.removeItem("userName");
	                    window.location.href = "sign-in.html";
	                    break;
	                case 403:
						window.sessionStorage.removeItem("username");
						window.location.href = request.getResponseHeader("location");
                    default:
                        document.getElementById("error").textContent = message;
                }
            }
        });
    };
})();