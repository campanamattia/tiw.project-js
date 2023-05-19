var draggedElement = null;

var pushNewSorting = function(playlistName){
    let list = document.getElementById("sorting-page").querySelector("ul").querySelectorAll("li");
    if(list.length <= 1){
		document.getElementById("sorting-page").querySelector("#error").textContent = "Add more songs to order you playlist";
        render.showSortingPage();
        return;
	}
    
    if (list.length !== songsInPlaylist.length){
        document.getElementById("sorting-page").querySelector("#error").textContent = "You must sort all the songs";
        render.showSortingPage();
        return;
    }
    
    let newSort = [];
    for(let i = 0;i<list.length; i++){
        newSort.push(parseInt(list[i].id));
    }
    makeCall("POST", "EditSorting?playlistName=" + playlistName, null, function(res){
        if(res === XMLHttpRequest.DONE){
            let message = res.responseText;
            switch(res.satus){
                case 200:
                    
					 makeCall("GET", "GetSongsInPlaylist?playlistName=" + playlistName, null, function (res1) {
	                        if (res1.readyState === XMLHttpRequest.DONE) {
	                            let message1 = res1.responseText;
	                            switch (res1.status) {
									case 200:
										document.getElementById("playlist-page").querySelector("#message").textContent = "Sorting succesfully saved";
                    					lowerBound = 0;
										songsInPlaylist = JSON.parse(message1);
		                                reset.resetSortingPage();
		                                render.showPlaylistPage(playlistName);
		                                break;
		                            case 403:
										sessionStorage.clear();
										window.location.href = res1.getResponseHeader("location");
										break;
	                            default:
	                                document.getElementById("playlist-page").querySelector("#error").textContent = message1; //error
	                            }
	                        }
	                    }, null, false);

                    break;
                case 403:
					sessionStorage.clear();
                    window.location.href = res.getResponseHeader("location");
					break;
                default: document.getElementById("sorting-page").querySelector("#error").textContent = message;
            }
        }
    }, newSort, false);
}

var dragStart = function(e) {
    draggedElement = e.target;
};

var dragOver = function(e) {
    e.preventDefault();
};

var drop = function(e) {
	let targetElement = e.target;
	if (targetElement === draggedElement) {
		draggedElement = null;
        return;
    }
    let ul = e.target.closest("ul");
	let list = ul.querySelectorAll("li");
	let destinationIndex = list.indexOf(targetElement);
	let startingIndex = list.indexOf(draggedElement);
	
	if(startingIndex < destinationIndex){
		if(destinationIndex != list.length-1){
			ul.insertBefore(draggedElement,list[destinationIndex+1]);
		}
		else ul.appendChild(draggedElement);
	}
	else{
		ul.insertBefore(draggedElement,list[destinationIndex]);
	}
	draggedElement = null;
}