
window.addEventListener("load" , (event) => {
    if(sessionStorage.getItem("userName") == null){
        window.location.href = "../sign-in.html";
    }else{
        render.showHomePage();
    }
} , false);