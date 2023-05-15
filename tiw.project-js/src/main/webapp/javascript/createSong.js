(function() {
    document.getElementById("create-song").addEventListener("submit", (event) => {
        let form = event.target.closest("form");
        if (form.checkValidity() === true) {

            document.getElementById("home-page").querySelectorAll(".message").stream().forEach(element => {
                element.textContent = "";
            });
            document.getElementById("home-page").querySelector(".error").stream().forEach(element => {
                element.textContent = "";
            });

            makeCall("POST", "CreateSong", form, function(res) {
                if (res.readyState === XMLHttpRequest.DONE) {
                    let message = res.responseText;
                    switch (res.status) {
						case 200:
                        	document.getElementById("home-page").querySelector("#song-message").textContent = "Song succesfully uploaded";
                        	listSong = JSON.parse(message);
                        	render.showCheckBoxSongs();
                        	break;
                        case 403:
							window.sessionStorage.removeItem("username");
							window.location.href = request.getResponseHeader("location");
							break;
                    	default:
                        	document.getElementById("home-page").querySelector("#song-error").textContent = message;
                    }
                }
            });

        } else {
            form.reportValidity();
        }
    });
})();