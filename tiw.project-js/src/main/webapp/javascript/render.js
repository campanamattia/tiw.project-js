var render = new Render();
var listPlaylist;
var listSong;
var lowerBound = 0;


function Render(){
    this.showHome = function(){
        document.getElementById("home-page").className = "home-page";
        document.getElementById("playlist-page").className = "masked";
        documetn.getElementById("player-page").className = "masked";
        document.getElementById("sorting-page").className = "masked";

        document.getElementById("title").textContent = "Welcome back" + sessionStorage.getItem("userName");
        document.getElementById("error").textContent = null;

        if(listPlaylist == null){
            makeCall("GET", "GetPlaylist", null, function(res){
                if(res.readyState === XMLHttpRequest.DONE){
                    let message = res.responseText;
                    if(res.status === 200){
                        this.listPlaylist = JSON.parse(message);
                        render.showAllPlaylist();
                    }else{
                        document.getElementById("pll-error").textContent = message;
                    }
                }
            });
        } else render.showAllPlaylist();
        if(listSong == null){
            makeCall("GET", "GetSong", null, function(res){
                if(res.readyState === XMLHttpRequest.DONE){
                    let message = res.responseText;
                    if(res.status === 200){
                        this.listSong = JSON.parse(message);
                        render.showAllSong();
                    }else{
                        document.getElementById("sl-error").textContent = message;
                    }
                }
            });
        } else render.showAllSong();
    } 

    this.showAllPlaylist = function(){
        let table = document.getElementById("playlist-table");
        //empty the table
        table.innerHTML = "";
       
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
                            render.showPlaylist(playlistName, JSON.parse(message));
                        }else{
                            document.getElementById("sl-error").textContent = message;
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
          

    this.showAllSong = function(){

    }

    this.showPlaylist = function(playlistName, songInPlaylist){
        //show the playlist page
        document.getElementById("home-page").className = "masked";
        document.getElementById("playlist-page").className = "playlist-page";
        documetn.getElementById("player-page").className = "masked";
        document.getElementById("sorting-page").className = "masked";

        //show the playlist name
        document.getElementById("title").textContent = "Playlist: " + playlistName;
        document.getElementById("error").textContent = null;

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
}