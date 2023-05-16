(function(){
    document.getElementById("add-song-form").addEventListener("submit", (e) => {
		e.preventDefault();
        let form = e.target;
        if(form.checkValidity() === true){
			
			document.getElementById("playlist-page").querySelectorAll(".message").stream().forEach(element => {
                element.textContent = "";
            });
            document.getElementById("playlist-page").querySelector(".error").stream().forEach(element => {
                element.textContent = "";
            });
            
            let selected = 0;
	        let radioboxes = form.querySelectorAll('input[type="radio"]');
	        
	        for (let i = 0; i < radioboxes.length; i++) {
			  if (radioboxes[i].checked) {
			    selected++;
			    if(selected == 2) break;
			  }
			}
			
			if(selected == 0) {
				document.getElementById("playlist-page").querySelector("#song-error").textContent = "Select at least one song";
				return;
			} 
			if(selected != 1) {
				document.getElementById("playlist-page").querySelector("#song-error").textContent = "Select only one song";
				return;
			}
			
			makeCall("POST", "EditPlaylist", form, function(res) {
                if (res.readyState === XMLHttpRequest.DONE) {
                    let message = res.responseText;
                    switch (res.status) {
						case 200:
                        	document.getElementById("playlist-page").querySelector("#message").textContent = "Song succesfully added to the playlist";
                        	songsInPlaylist = JSON.parse(message);
                        	render.showPlaylistPage();
                        	break;
                        case 403:
							window.sessionStorage.removeItem("userName");
							window.location.href = request.getResponseHeader("location");
							break;
                    	default:
                        	document.getElementById("playlist-page").querySelector("#song-error").textContent = message;
                    }
                }
            }, null, false);
				
        }else{
            form.reportValidity();
        }
    });
})();