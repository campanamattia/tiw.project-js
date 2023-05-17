(function() {
    document.getElementById("song-form").addEventListener("submit", (e) => {
		e.preventDefault();
        let form = e.target;
        if (form.checkValidity() === true) {

            document.getElementById("home-page").querySelectorAll(".message").forEach(element => {
                element.textContent = "";
            });
            document.getElementById("home-page").querySelectorAll(".error").forEach(element => {
                element.textContent = "";
            });

            makeCall("POST", "CreateSong", form, function(res) {
                if (res.readyState === XMLHttpRequest.DONE) {
                    let message = res.responseText;
                    switch (res.status) {
						case 200:
							
							makeCall("GET", "GetSongList", null, function (res1) {
		                    if (res1.readyState === XMLHttpRequest.DONE) {
		                        let message1 = res1.responseText;
		                        switch (res1.status) {
									case 200:
										document.getElementById("home-page").querySelector("#song-message").textContent = "Song succesfully uploaded";
			                            listSong = JSON.parse(message1);
			                            form.reset();
                        				render.showCheckBoxSongs();
			                            break;
			                        case 403:
										window.sessionStorage.removeItem("userName");
										window.location.href = res1.getResponseHeader("location");
										break;
		                        	default:
		                            	document.getElementById("home-page").querySelector("#get-songs-error").textContent = message1; //song list error
		                        }
		                    }
		                }, null, false);
                        	
                        	break;
                        case 403:
							window.sessionStorage.removeItem("userName");
							window.location.href = res.getResponseHeader("location");
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