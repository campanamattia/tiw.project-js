var render = new Render();

//for home page use
var listPlaylist = null;
var listSong = null;

//for playlist and sorting page use
var songInPlaylist = null;
var lowerBound = 0;


class Render {
    constructor() {

        this.showHomePage = function () {

            //resetting the document
            render.reset();

            //make the home page the only visible page
            document.getElementById("home-page").className = "on";
            document.getElementById("playlist-page").className = "off";
            documetn.getElementById("player-page").className = "off";
            document.getElementById("sorting-page").className = "off";

            document.getElementById("home-button").className = "off";

            //writing the welcome message
            let home = document.getElementById("home-page");
            let title = home.querySelector("#title");
            title.textContent = "Welcome " + sessionStorage.getItem("userName");

            if (listPlaylist == null) {
                makeCall("GET", "GetPlaylistList", null, function (res) {
                    if (res.readyState === XMLHttpRequest.DONE) {
                        let message = res.responseText;
                        if (res.status === 200) {
                            this.listPlaylist = JSON.parse(message);
                            render.showAllPlaylistList(home);
                        } else {
                            home.querySelector("#playlist-error").textContent = message; //playlist list error
                        }
                    }
                });
            } else
                render.showAllPlaylistList(home);
            if (listSong == null) {
                makeCall("GET", "GetSongs", null, function (res) {
                    if (res.readyState === XMLHttpRequest.DONE) {
                        let message = res.responseText;
                        if (res.status === 200) {
                            this.listSong = JSON.parse(message);
                            render.showCheckBoxSongs(home);
                        } else {
                            home.querySelector("#songlist-error").textContent = message; //song list error
                        }
                    }
                });
            } else
                render.showCheckBoxSongs(home);
        };

        this.showAllPlaylistList = function (home) {

            let table = home.querySelector("playlist-table");

            for (let i = 0; i < listPlaylist.length; i++) {
                let row = document.createElement("tr");

                //add the name
                let columnName = document.createElement("td");
                let playlistName = document.createTextNode(this.listPlaylist[i].name);

                //add event listener to the playlist name
                columnName.addEventListener("click", function () {
                    makeCall("GET", "GetSongInPlaylist?playlistName=" + playlistName, null, function (res) {
                        if (res.readyState === XMLHttpRequest.DONE) {
                            let message = res.responseText;
                            if (res.status === 200) {
                                render.showPlaylistPage(playlistName, JSON.parse(message));
                            } else {
                                home.querySelector("#playlist-error").textContent = message; //playlist error
                            }
                        }
                    });
                });
                columnName.appendChild(playlistName);
                row.appendChild(columnName);

                //add the date
                let columnDate = document.createElement("td");
                let playlistDate = document.createTextNode(this.listPlaylist[i].date);
                columnDate.appendChild(playlistDate);
                row.appendChild(columnDate);

                table.appendChild(row);
            }
        };


        this.showCheckBoxSongs = function (home) {

            let checkbox = home.querySelector("#song-checkbox");

            //add the songs to the checkbox
            for (let i = 0; i < this.listPlaylist.length; i++) {
                //creating the chackbox element
                let box = document.createElement("input");
                let label = document.createElement("label");
                box.type = "checkbox";
                box.name = "song" + i;
                label.htmlFor = "song" + i;
                box.id = "song" + i;
                box.value = this.listPlaylist[i].id;
                label.textContent = this.listPlaylist[i].name;

                //adding the song to the checkbox
                checkbox.appendChild(label);
                checkbox.appendChild(box);
            }

        };

        this.showPlaylistPage = function (playlistName, songInPlaylist) {
            //resetting the document
            render.reset();

            //make the playlist page the only visible page
            document.getElementById("home-page").className = "off";
            document.getElementById("playlist-page").className = "on";
            documetn.getElementById("player-page").className = "off";
            document.getElementById("sorting-page").className = "off";

            document.getElementById("home-button").className = "on";

            //show the playlist name
            let playlist = document.getElementById("playlist-page");
            let title = playlist.querySelector("#title");
            title.textContent = "Playlist: " + playlistName;
            
            playlist.querySelector("add-song").textContent= "UPDATE " + playlistName;

            let table = document.getElementById("song-table");
            //empty the table
            table.innerHTML = "";
            let row = document.createElement("tr");
            //add five sogns or less to the table
            var newBlock = function () {
                if (lowerBound < 0)
                    lowerBound = 0;
                else lowerBound -= lowerBound % 5;
                
                for (let i = lowerBound; i < songInPlaylist.length && i < lowerBound + 5; i++) {
                    //create a column
                    let column = document.createElement("td");
                    let insideTable = document.createElement("table");

                    //create a row for the image
                    let insideImage = document.createElement("tr");
                    let image = document.createElement("img");
                    image.src = this.songInPlaylist[i].imageContent;
                    insideImage.appendChild(image);
                    insideTable.appendChild(insideImage);

                    //create a row for the name
                    let insideTitle = document.createElement("tr");
                    let title = document.createTextNode(songInPlaylist[i].title);

                    //add event listener to the song name
                    insideTitle.addEventListener("click", function () {
                        makeCall("GET", "PlaySong?songId=" + songInPlaylist[i].id, null, function (res) {
                            if (res.readyState === XMLHttpRequest.DONE) {
                                let message = res.responseText;
                                if (res.status === 200) {
                                    render.playSong(this.songInPlaylist[i], JSON.parse(message));
                                } else {
                                    playlist.querySelector("#error").textContent = message; //player playlist table error
                                }
                            }
                        });
                    });
                    insideTitle.appendChild(title);
                    insideTable.appendChild(insideTitle);

                    //insert the insideTable into the column and the column into the row
                    column.appendChild(insideTable);
                    row.appendChild(column);
                }
                //add the row to the table
                table.appendChild(row);

                //add the buttons
                let prec = playlist.querySelector("#precButton");
                let next = playlist.querySelector("#nextButton");

                //set the prec button
                if (this.lowerBound <= 0) {

                    //if the lower bound is lower than zero then we trun off the prec button
                    prec.className = "off";
                    prec.removeEventListener("click", previousBlock);
                } else {

                    //if the lower bound is greater than zero then we turn on the prec button
                    prec.className = "on";
                    prec.addEventListener("click", previousBlock);
                }

                //set the next button
                if (this.lowerBound + 5 >= songInPlaylist.length) {

                    //if the lower bound is greater than song In Playlist then we turn off the next button
                    next.className = "off";
                    next.removeEventListener("click", nextBlock);
                } else {

                    //if the lower bound is less than song In Playlist then we turn on the next button
                    next.className = "on";
                    next.addEventListener("click", nextBlock);
                }

                let previousBlock = function () {
                    this.lowerBound -= 5;
                    newBlock();
                };
                let nextBlock = function () {
                    this.lowerBound += 5;
                    newBlock();
                };
            } ();

            //all the songs the user can add to the playlist
            let songRoundBox = playlist.querySelector("#song-roundbox");

            let songnonInPlaylist = [...this.listSong];

            songnonInPlaylist = songnonInPlaylist.filter(songNot => {
            return !songInPlaylist.some(songIn => songIn.id === songNot.id);
            });

            //add the songs to the checkbox
            for (let i = 0; i < songnonInPlaylist.length; i++) {

                //creating the radiobox element
                let box = document.createElement("input");
                let label = document.createElement("label");
                box.type = "radio";
                box.name = "song";
                label.htmlFor = "song" + i;
                box.id = "song" + i;
                box.value = songnonInPlaylist[i].id;
                label.textContent = songnonInPlaylist[i].name;

                //adding the song to the checkbox
                checkbox.appendChild(label);
                checkbox.appendChild(box);
            }
        };

        this.playSong = function (song, details) {
            //resetting the document
            render.reset();

            //make the player page the only visible page
            document.getElementById("home-page").className = "off";
            document.getElementById("playlist-page").className = "off";
            documetn.getElementById("player-page").className = "on";
            document.getElementById("sorting-page").className = "off";

            let playerPage = document.getElementById("player-page");
            let infoContainer = playerPage.querySelector("#info");
            infoContainer.innerHTML = "";

            //add the image
            let div = document.createElement("div");
            let image = document.createElement("img");
            image.src = song.imageContent;
            div.appendChild(image);
            infoContainer.appendChild(div);

            //add the title
            div.removeChild(image);
            let title = document.createElement("h1");
            title.textContent = "Title: " + song.title;
            div.appendChild(title);
            infoContainer.appendChild(div);

            //add the other info
            div.removeChild(infoContainer);
            let singer = document.createElement("h1");
            singer.textContent = "Singer: " + details.singer;
            div.appendChild(singer);
            let album = document.createElement("h2");
            singer.textContent = "Album: " + details.album;
            div.appendChild(album);
            let year = document.createElement("h3");
            singer.textContent = "Publication Year: " + details.year;
            div.appendChild(year);
            let genre = document.createElement("hp");
            singer.textContent = "Genre: " + details.genre;
            div.appendChild(genre);
            infoContainer.appendChild(div);

            //add the player
            let player = document.getElementById("player");
            player.src = details.songContent;
            playerPage.appendChild(player);
        };

        this.showSortingPage = function () {
            //resetting the document
            render.reset();

            //make the sorting page the only visible page
            document.getElementById("home-page").className = "off";
            document.getElementById("playlist-page").className = "off";
            documetn.getElementById("player-page").className = "off";
            document.getElementById("sorting-page").className = "on";

            document.getElementById("home-button").className = "on";

            let sortingPage = document.getElementById("sorting-page");
            let div = document.createElement("div");
            div.className = "row-container";

            let title = document.createElement("h1");
            title.textContent = "Sorting: "+ playlist.name;
            div.appendChild(title);

            let submitButton = document.createElement("button");
            submitButton.className = "sorting-button";
            submitButton.textContent = "Save Changes";
            submitButton.addEventListener("click", function () {
                pushSorting();
            });
            div.appendChild(submitButton);
            sortingPage.appendChild(div);

            let box = document.createElement("div");
           // i need a list or a table??
        };

        this.reset() = function () {
            reset.resetHomePage();
            reset.resetPlaylistPage();
            reset.resetPlayerPage();
            reset.resetSortingPage();
        };
    }
}