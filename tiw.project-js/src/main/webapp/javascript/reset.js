var reset = new Reset();

function Reset() {
    this.resetHomePage = function() {
        let homePage = document.getElementById("home-page");

        //resetting the errors and messages on the home page
        homePage.querySelectorAll(".message").stream().forEach(element => {
            element.textContent = "";
        });
        homePage.querySelector(".error").stream().forEach(element => {
            element.textContent = "";
        });

        //resetting the playlist table
        let playlistTable = homePage.querySelector("#playlist-table");
        playlistTable.innerHTML = "";


        //resetting the checkboxes field
        let songCheck = homePage.querySelector("#song-checkBox");
        songCheck.innerHTML = "";
    }

    this.resetPlaylistPage = function() {
        //lowerBound = 0;
        
    }

    this.resetPlayerPage = function() {

    }

    this.resetSortingPage = function() {

    }
}