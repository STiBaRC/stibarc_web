function logout() {
	//var cookie = toJSON(document.cookie);
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/logout.sjs?sess=" + sess, false);
	xmlHttp.send(null);
	window.localStorage.removeItem("sess");
	window.localStorage.removeItem("username");
	location.href = "index.html";
}

window.onload = function () {
	logout();
}
