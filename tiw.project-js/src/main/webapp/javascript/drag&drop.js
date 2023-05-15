{
    var pushNewSorting = function(){
        let newSort = [];
        if (list.querySelectorAll("li").length != songInPlaylist.length){
            document.getElementById("sorting-page").querySelector("error").textContent = "You must sort all the songs";
            render.showSortingPage();
        }
        for(let i = o; list.querySelectorAll("li").length; i++){
            newSort.push(list.querySelectorAll("li")[i].id);
        }
        makeCall("POST", "/EditSorting", null, function(res){
            if(res === XMLHttpRequest.DONE){
                let message = res.responseText;
                switch(message){
                    case 200:
                        applyNewSort(newSort);
                        break;
                    case 403:
                        window.location.href = request.getResponseHeader("location");
						break;
                    default: document.getElementById("sorting-page").querySelector("error").textContent = message;
                }
            }
        }, newSort);
    }
    
    document.addEventListener("load", function dragANDdrop(event) {
        var list = document.getElementById("sorting-page").querySelector("sorting-ul");
        let draggingElement = null;

        list.addEventListener("dragstart", function(event) {
            draggingElement = event.target;
            event.target.classList.add("dragging");
        });

        list.addEventListener("dragend", function(event) {
            event.target.classList.remove("dragging");
            draggingElement = null;
        });

        list.addEventListener("dragover", function(event) {
            event.preventDefault();
            let targetElement = event.target;
            if (targetElement === draggingElement) {
                return;
            }
            let boundingRect = target.getBoundingClientRect();
            let offset = boundingRect.y + boundingRect.height / 2;
            if (event.clientY - offset > 0) {
                targetElement.parentNode.insertBefore(draggingElement, targetElement.nextElementSibling);
            } else {
                targetElement.parentNode.insertBefore(draggingElement, targetElement);
            }
        });

        list.addEventListener("dragenter", function(event) {
            event.target.classList.add("placeholder");
        });

        list.addEventListener("dragleave", function(event) {
            event.target.classList.remove("placeholder");
        });
    });

    var applyNewSort = function(newSort){
        let copy = [];
        for(let i = 0; i < newSort.length; i++){
            copy.push(songInPlaylist.getSong(newSort[i]));
        }
        songInPlaylist = copy;
    }
}

  