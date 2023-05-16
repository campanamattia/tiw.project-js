var goHome = function (){
	document.getElementById("home-button").onclick = function(e){
		e.preventDefault();
		render.showHomePage();
	};
};