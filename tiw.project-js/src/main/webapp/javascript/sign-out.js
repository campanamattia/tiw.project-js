(function(){
    document.getElementById("sign-out").addEventListener("click", (e) => {
		e.preventDefault();
        makeCall("GET", 'SignOut', null, function (res) {
            if(res.readyState === XMLHttpRequest.DONE){
                let message = res.responseText;
                switch(res.status){
					case 200:
	                    sessionStorage.removeItem("userName");
	                    window.location.href = "sign-in.html";
	                    break;
	                case 403:
						window.sessionStorage.removeItem("userName");
						window.location.href = request.getResponseHeader("location");
                    default:
                        document.getElementById("error").textContent = message;
                }
            }
        }, null, false);
    },false);
})();