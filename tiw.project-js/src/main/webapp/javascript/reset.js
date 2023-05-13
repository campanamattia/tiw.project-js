var reset = new Reset();

function Reset() {
    this.resetHomePage = function() {
        let homePage = document.getElementById("home-page");

        //resetting the errors on the home page
        let errors = homePage.querySelectorAll(".error");
        errors().forEach(error => {
            error.innerHTML = "";
        });

        //resetting the playlist table
        let playlistTable = homePage.querySelector("#playlist-table");
        playlistTable.innerHTML = "";


        //resetting the checkboxes field
        let songCheck = homePage.querySelector("#song-checkBox");
        songCheck.innerHTML = "";
    }

    this.resetPlaylistPage = function() {

    }

    this.resetPlayerPage = function() {

    }

    this.resetSortingPage = function() {

    }
}