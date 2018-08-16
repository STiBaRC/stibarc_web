function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
		lastid = splits[0];
	} catch (err) {
		console.log("Whoops");
	}
}

//Unused
/*var checkId = function () {
	var id = window.localStorage.getItem("appID");
	if (id == null || id == "" || id == undefined) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "https://api.stibarc.gq/getappid.sjs", false);
		xmlHttp.send(null);
		window.localStorage.setItem("appID", xmlHttp.responseText);
	}
}*/

function checkSess() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/checksess.sjs?sess="+sess, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.split("\n")[0] == "bad") {
		window.localStorage.removeItem("sess");
		window.localStorage.removeItem("username");
		location.reload();
	}
}

function getUsername() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/getusername.sjs", false);
	xmlHttp.send("sess="+sess);
	window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var lastid = 1;

function loadMore() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/getposts.sjs?id="+lastid, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.trim() != "") {
		var tmp = xmlHttp.responseText.split("\n");
		for (i = 0; i < tmp.length - 1; i++) {
			toLink(tmp[i]);
		}
	} else {
		document.getElementById("loadmorecontainer").style.display = "none";
	}
}

window.onload = function () {
	if (location.protocol == "http:") {
		location.protocol = "https:"
	}
	var offline = false;
	//var cookie = toJSON(document.cookie);
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != null && sess != "") {
		checkSess();
		document.getElementById("loggedout").style.display = "none";
		document.getElementById("loggedin").style.display = "";
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	document.getElementById("loadmore").onclick = function(evt) {
		loadMore();
	}
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/getposts.sjs", false);
	try {
		xmlHttp.send(null);
	} catch (err) {
		offline = true;
	}
	if (!offline) {
		if (window.localStorage.getItem("username") == "" || window.localStorage.getItem("username") == undefined) {
			if (sess != undefined && sess != null && sess != "") {
				getUsername();
			}
		}
		//checkId();
		var tmp = xmlHttp.responseText.split("\n");
		document.getElementById("shitlist").innerHTML = "";
		for (i = 0; i < tmp.length - 1; i++) {
			toLink(tmp[i]);
		}
		document.getElementById("loadmorecontainer").style.display = "";
	} else {
		document.getElementById("shitlist").innerHTML = "Error loading posts. Device offline.";
	}
	startNotifs();
}
