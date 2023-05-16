var goHome = function (){
	document.getElementById("home-button").addEventListener("click", (e) => {
		e.preventDefault();
		render.showHomePage();
	},false);
};