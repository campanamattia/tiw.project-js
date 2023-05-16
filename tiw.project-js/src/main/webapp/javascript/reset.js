var reset = new Reset();

function Reset() {
    this.resetHomePage = function() {
        let homePage = document.getElementById("home-page");
        
        //reset the title
        home.querySelector("#title").textContent = "";

        //reset errors and messages
        homePage.querySelectorAll(".message").stream().forEach(element => {
            element.textContent = "";
        });
        homePage.querySelector(".error").stream().forEach(element => {
            element.textContent = "";
        });

        //reset the playlist table
        homePage.querySelector("#playlist-table").innerHTML = "";


        //reset the checkbox fields
        homePage.querySelector("#song-checkBox").innerHTML = "";
    }

    this.resetPlaylistPage = function() {
        lowerBound = 0;

        let playlistPage = document.getElementById("playlist-page");
        
        //reset the title
        playlistPage.querySelector("#title").textContent = "";
        
        //reset errors and messages
        playlistPage.querySelectorAll(".message").stream().forEach(element => {
            element.textContent = "";
        });
        playlistPage.querySelector(".error").stream().forEach(element => {
            element.textContent = "";
        });
        
        //reset the table containing the songs
        playlistPage.querySelector("#song-table").innerHTML = "";
        
        //remove the buttons
        let prec = playlistPage.querySelector("#precButton");
        let next = playlistPage.querySelector("#nextButton");
        prec.className = "off";
        next.className = "off";
        prec.onclick = null;
        next.onclick = null;
        
        //reset the title in the edit section
        playlistPage.querySelector("add-song").textContent = "";
        
        //reset the form that adds songs in the playlist
        playlistPage.querySelector("#playlistName").value = "";
        playlistPage.querySelector("#song-roundbox").innerHTML = "";
        
    }

    this.resetPlayerPage = function() {
		let playerPage = document.getElementById("player-page");
		
		//reset the song details
		playerPage.querySelector("#info").innerHTML = "";
    }

    this.resetSortingPage = function() {
		let sortingPage = document.getElementById("sorting-page");
		
		//reset the title
        sortingPage.querySelector("#title").textContent = "";
        
        //reset the list of songs
        sortingPage.querySelector("#sorting-ul").innerHTML = "";
        
        //reset the update button
        sortingPage.querySelector("#update").onclick = null;
    }
}