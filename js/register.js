function register() {
	var name = document.getElementById("name").value;
	var showname = document.getElementById("showname").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var password2 = document.getElementById("password2").value;
	var email = document.getElementById("email").value;
	var showemail = document.getElementById("showemail").value;
	var bday = document.getElementById("bday").value;
	var showbday = document.getElementById("showbday").value;
	if (username != "" && username != null && username != undefined && password != "" && password != null && password != undefined && password2 != "" && password2 != null && password2 != undefined) {
		if (password == password2) {
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.gq/createuser.sjs", false);
			thing.send("username="+username+"&password="+password+"&password2="+password2+"&email="+email+"&showemail="+showemail+"&birthday="+bday+"&showbday="+showbday+"&name="+name);
			if (thing.responseText == "Created\n") {
				location.href = "login.html";
			} else {
				document.getElementById("err").style.display = "";
			}
		} else {
			document.getElementById("pword").style.display = "";
		}
	} else {
		document.getElementById("blank").style.display = "";
	}
}

window.onload = function () {
	document.getElementById("send").onclick = function (evt) {
		register();
	}
}