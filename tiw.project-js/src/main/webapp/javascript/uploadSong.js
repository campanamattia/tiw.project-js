(function() {
    document.getElementById("upload-song").addEventListener("submit", (event) => {
        let form = event.target.closest("form");
        if (form.checkValidity() === true) {

            document.getElementById("home-page").querySelectorAll(".message").stream().forEach(element => {
                element.textContent = "";
            });
            document.getElementById("home-page").querySelector(".error").stream().forEach(element => {
                element.textContent = "";
            });

            makeCall("POST", "UploadSong", form, function(res) {
                if (res.readyState === XMLHttpRequest.DONE) {
                    let message = res.responseText;
                    if (res.status === 200) {
                        document.getElementById("home-page").querySelector("#song-message").textContent = message;
                    } else {
                        document.getElementById("home-page").querySelector("#song-error").textContent = message;
                    }
                }
            });

        } else {
            form.reportValidity();
        }
    });
})();