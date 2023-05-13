window.addEventListener("load" , () => {
    if(sessionStorage.getItem("userName") == null){
        window.location.href = "../sign-in.html";
    }else{
        pageOrchestrator.start();
        pageOrchestrator.refresh();
    }
} , false);