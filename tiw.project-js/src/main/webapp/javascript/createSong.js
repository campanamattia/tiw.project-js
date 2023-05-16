(function() {
    document.getElementById("song-form").addEventListener("submit", (e) => {
		e.preventDefault();
        let form = e.target;
        if (form.checkValidity() === true) {

            document.getElementById("home-page").querySelectorAll(".message").forEach(element => {
                element.textContent = "";
            });
            document.getElementById("home-page").querySelector(".error").forEach(element => {
                element.textContent = "";
            });

            makeCall("POST", "CreateSong", form, function(res) {
                if (res.readyState === XMLHttpRequest.DONE) {
                    let message = res.responseText;
                    switch (res.status) {
						case 200:
                        	document.getElementById("home-page").querySelector("#song-message").textContent = "Song succesfully uploaded";
                        	listSong = JSON.parse(message);
                        	form.reset();
                        	render.showCheckBoxSongs();
                        	break;
                        case 403:
							window.sessionStorage.removeItem("userName");
							window.location.href = request.getResponseHeader("location");
							break;
                    	default:
                        	document.getElementById("home-page").querySelector("#song-error").textContent = message;
                    }
                }
            }, null, false);

        } else {
            form.reportValidity();
        }
    },false);
})();