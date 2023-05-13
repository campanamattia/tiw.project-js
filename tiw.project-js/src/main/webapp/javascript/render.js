var render = new Render();

//for home page use
var listPlaylist;
var listSong;

//for playlist and sorting page use
var songInPlaylist;
var lowerBound = 0;


function Render(){
    this.showHomePage = function(){

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
        title.textContent = "Welcome back" + sessionStorage.getItem("userName");

        if(listPlaylist == null){
            makeCall("GET", "GetPlaylistList", null, function(res){
                if(res.readyState === XMLHttpRequest.DONE){
                    let message = res.responseText;
                    if(res.status === 200){
                        this.listPlaylist = JSON.parse(message);
                        render.showAllPlaylistList(home);
                    }else{
                        document.getElementById("playlist-error").textContent = message; //playlist list error
                    }
                }
            });
        } else render.showAllPlaylistList(home);
        if(listSong == null){
            makeCall("GET", "GetSongs", null, function(res){
                if(res.readyState === XMLHttpRequest.DONE){
                    let message = res.responseText;
                    if(res.status === 200){
                        this.listSong = JSON.parse(message);
                        render.showCheckBoxSongs(home);
                    }else{
                        document.getElementById("songlist-error").textContent = message; //song list error
                    }
                }
            });
        } else render.showCheckBoxSongs(home);
    } 

    this.showAllPlaylistList = function(home){
        
        let table = home.querySelector("playlist-table");
       
        for (let i = 0; i < listPlaylist.length; i++) {
            let row = document.createElement("tr");

            //add the name
            let columnName = document.createElement("td");
            let playlistName = document.createTextNode(this.listPlaylist[i].name);

                //add event listener to the playlist name
            columnName.addEventListener("click", function() {
                makeCall("GET", "GetSongInPlaylist?playlistName="+playlistName, null, function(res){
                    if(res.readyState === XMLHttpRequest.DONE){
                        let message = res.responseText;
                        if(res.status === 200){
                            render.showPlaylistPage(playlistName, JSON.parse(message));
                        }else{
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
          

    this.showCheckBoxSongs = function(home){

        let checkbox = home.querySelector("#song-checkbox");

        //add the songs to the checkbox
        for (let i = 0; i < this.listPlaylist.length; i++){
            //creating the chackbox element
            let box = document.createElement("input");
            let label = document.createElement("label");
            box.type = "checkbox";
            box.name = "song"+i;
            label.htmlFor = "song"+i;
            box.id = "song"+i;
            box.value = this.listPlaylist[i].id;
            label.textContent = this.listPlaylist[i].name;

            //adding the song to the checkbox
            checkbox.appendChild(label);
            checkbox.appendChild(box);
        }

    }

    this.showPlaylistPage = function(playlistName, songInPlaylist){
        //resetting the document
        render.reset();

        //make the playlist page the only visible page
        document.getElementById("home-page").className = "off";
        document.getElementById("playlist-page").className = "on";
        documetn.getElementById("player-page").className = "off";
        document.getElementById("sorting-page").className = "off";

        //show the playlist name
        let playlist = document.getElementById("playlist-page");
        let title = playlist.querySelector("#title");
        title.textContent ="Playlist: " + playlistName;

        let table = document.getElementById("song-table");
        //empty the table
        table.innerHTML = "";
        let row = document.createElement("tr");
        //add five sogns or less to the table
        for (let i = lowerBound; i < songInPlaylist.length && i< lowerBound+5; i++) {
            //create a column
            let column = document.createElement("td");
            let insideTable = document.createElement("table");

            //create a row for the image
            let insideImage = document.createElement("tr");
            let image = document.createElement("img");
            image.src = songInPlaylist[i].imageContent;
            image.className = "image";
            insideImage.appendChild(image);
            insideTable.appendChild(insideImage);

            //create a row for the name
            let insideName = document.createElement("tr");
            let name = document.createTextNode(songInPlaylist[i].name);

                //add event listener to the song name
            insideName.addEventListener("click", function() {
                makeCall("GET", "PlaySong?songName="+name, null, function(res){
                    if(res.readyState === XMLHttpRequest.DONE){
                        let message = res.responseText;
                        if(res.status === 200){
                            render.playSong(JSON.parse(message));
                        }else{
                            document.getElementById("ppt-error").textContent = message; //player playlist table error
                        }
                    }
                });
            });
            insideName.appendChild(name);
            insideTable.appendChild(insideName);

            //insert the insideTable into the column and the column into the row
            column.appendChild(insideTable);
            row.appendChild(column);
        }
        //add the row to the table
        table.appendChild(row);
        this.lowerBound += 5;

        //add the buttons
        
    }

    this.playSong = function(song){
        //resetting the document
        render.reset();

        //make the player page the only visible page
        document.getElementById("home-page").className = "off";
        document.getElementById("playlist-page").className = "off";
        documetn.getElementById("player-page").className = "on";
        document.getElementById("sorting-page").className = "off";

        let infoContainer = document.getElementById("infoContainer");
        infoContainer.innerHTML = "";

        //add the image
        let div = document.createElement("div");
        let image = document.createElement("img");
        image.src = song.imageContent;
        image.className = "image";
        div.appendChild(image);
        infoContainer.appendChild(div);

        //add the title
        div.removeChild(image);
        let title = document.createElement("h1");
        title.textContent = song.name;
        div.appendChild(title);
        infoContainer.appendChild(div);

        //add the other info
        div.removeChild(infoContainer);
        let singer = document.createElement("h2");
        singer.textContent = song.singer;
        div.appendChild(singer);
        let album = document.createElement("h2");
        singer.textContent = song.album;
        div.appendChild(album);
        let year = document.createElement("h2");
        singer.textContent = song.year;
        div.appendChild(year);
        let genre = document.createElement("h2");
        singer.textContent = song.genre;
        div.appendChild(genre);
        infoContainer.appendChild(div);

        //add the player
        let player = document.getElementById("player");
        player.src = song.songContent;
        infoContainer.appendChild(player);
    }

    this.showSortingPage = function(){

    }

    this.reset() = function(){
        reset.resetHomePage();
        reset.resetPlaylistPage();
        reset.resetPlayerPage();
        reset.resetSortingPage();
    }
}