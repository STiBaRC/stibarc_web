function login() {
	document.getElementById("blank").style.display = "none";
	document.getElementById("badnamepass").style.display = "none";
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	if (username != undefined && username != "" && password != undefined && password != "") {
		var xmlHttp = new XMLHttpRequest();
		//var appid = window.localStorage.getItem("appID");
		//if (appid == "" || appid == null || appid == undefined) appid = "none";
		xmlHttp.open("POST", "https://api.stibarc.gq/createsess.sjs", false);
		xmlHttp.send("username=" + username + "&password=" + password);
		sess = xmlHttp.responseText;
		if (sess != "Invalid username or password\n") {
			//document.cookie = "sess=" + sess;
			window.localStorage.setItem("sess", sess.split("\n")[0]);
			window.localStorage.setItem("username", username);
			location.href = "index.html"
		} else {
			document.getElementById("badnamepass").style.display = "";
		}
	} else {
		document.getElementById("blank").style.display = "";
	}
}

window.onload = function () {
	document.getElementById("login").onclick = function (evt) {
		login();
	}
	document.getElementById("username").addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			document.getElementById("password").focus();
		}
	});
	document.getElementById("password").addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			login();
		}
	});
}
