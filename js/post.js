var pushed = false;

function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1]).concat("</a></li>");

	} catch (err) {
		console.log("Whoops");
	}
}

function getRank() {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/getuser.sjs?id=" + window.localStorage.getItem("username"), false);
	thing.send(null);
	var stuff = thing.responseText;
	var tmp = stuff.split("\n");
	var rank = tmp[4].split(":")[1];
	return rank;
}

function postcomment(id) {
	try {
	var again = window.localStorage.getItem("cancommentagain");
	if (again == null || again == "" || again == undefined) again = 0;
	var content = document.getElementById("comtent").value;
	if (content != "" && content != undefined && title != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			pushed = true;
			var n = new Date().getTime() + 15000;
			window.localStorage.setItem("cancommentagain", n);
			//var cookie = toJSON(document.cookie);
			//var sess = cookie.sess;
			document.getElementById("comtent").value = "";
			var sess = window.localStorage.getItem("sess");
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.gq/newcomment.sjs", false);
			thing.send("sess=" + sess + "&postid=" + id + "&content=" + encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
			location.reload();
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			document.getElementById("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			document.getElementById("wait").style.display = "";
		}
	}
	} catch(err) {
		senderr(err);
	}
}

function getAttach(id) {
	document.getElementById("viewattachment").style.display = "none";
	if (window.localStorage.getItem("cache"+id) == null || window.localStorage.getItem("cache"+id) == undefined) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "https://api.stibarc.gq/getimage.sjs?id="+id, false);
		xmlHttp.send();
		document.getElementById("image").src = xmlHttp.responseText;
		document.getElementById("image").style.display = "";
		var tmp = xmlHttp.responseText.split("");
		tmp = tmp[0]+tmp[1]+tmp[2]+tmp[3]+tmp[4];
		if (tmp == "data:") {
			window.localStorage.setItem("cache"+id, xmlHttp.responseText);
		}
	} else {
		document.getElementById("image").src = window.localStorage.getItem("cache"+id);
		document.getElementById("image").style.display = "";
	}
}

function replyto(guy) {
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		document.getElementById("comtent").value = document.getElementById("comtent").value + "@" + guy + " ";
		document.getElementById("comtent").focus();
	} else {
		location.href="login.html"
	}
}

function reloadvotes() {
	var id = getAllUrlParams().id;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/v2/getpost.sjs?id="+id, true);
	xmlHttp.onload = function(evt) {
		var stuff = JSON.parse(xmlHttp.responseText);
		document.getElementById("upvotes").innerHTML = stuff['upvotes'];
		document.getElementById("downvotes").innerHTML = stuff['downvotes'];
	}
	xmlHttp.send(null);
}

function upvote() {
	var sess = window.localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhr = new XMLHttpRequest();
		xhr.open("post", "https://api.stibarc.gq/upvote.sjs", true);
		xhr.onload = function(evt) {
			reloadvotes();
		}
		xhr.send("id="+id+"&sess="+sess);
	}
}

function downvote() {
	var sess = window.localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhr = new XMLHttpRequest();
		xhr.open("post", "https://api.stibarc.gq/downvote.sjs", true);
		xhr.onload = function(evt) {
			reloadvotes();
		}
		xhr.send("id="+id+"&sess="+sess);
	}
}

function delpost() {
	var pass = prompt("Admin password?");
	var id = getAllUrlParams().id;
	var xhr = new XMLHttpRequest();
	xhr.open("POST","https://stibarc.gq/management/delpost.sjs",true);
	xhr.send("adminpassword="+pass+"&id="+id);
	xhr.onload = function(evt) {
		location.reload();
	}
}

window.onload = function () {
	pushed = false;
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		document.getElementById("postout").style.display = "none";
		document.getElementById("postin").style.display = "";
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	var id = getAllUrlParams().id;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/v2/getpost.sjs?id="+id, false);
	xmlHttp.send(null);
	var stuff = JSON.parse(xmlHttp.responseText);
	document.getElementById("title").innerHTML = stuff.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	document.title = stuff.title + " - STiBaRC";
	document.getElementById("dateandstuff").innerHTML = 'Posted by <a href="user.html?id=' + stuff.poster + '">' + stuff.poster + '</a><span id="verified" title="Verified user" style="display:none">'+"✔️</span> at " + stuff.postdate;
	checkVerified(stuff.poster);
	document.getElementById("content").innerHTML = stuff.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
	if (stuff['edited'] == true) {
		document.getElementById("edited").style.display = "";
	}
	if (stuff.poster == window.localStorage.getItem("username") && getRank() != "User") {
		document.getElementById("editlink").style.display = "";
	}
	if (getRank() == "Owner") {
		document.getElementsByTagName("body")[0].innerHTML = '<button onclick="delpost()">Delete post</button>'+document.getElementsByTagName("body")[0].innerHTML;
	}
	if (stuff["attachment"] != "none" && stuff["attachment"] != undefined && stuff["attachment"] != null) {
		document.getElementById("attachment").style.display = "";
	}
	document.getElementById("upvotes").innerHTML = stuff['upvotes'];
	document.getElementById("downvotes").innerHTML = stuff['downvotes'];
	xmlHttp.open("GET", "https://api.stibarc.gq/getcomments.sjs?id=" + id, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText != "undefined\n") {
		var comments = JSON.parse(xmlHttp.responseText);
		for (var key in comments) {
			document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment"><a href="user.html?id=' + comments[key]['poster'] + '">' + comments[key]['poster'] + '</a><br/>' + comments[key]['content'].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>") + '<br/><a class="replyto" href="javascript:replyto('+"'"+comments[key]['poster']+"'"+')"><i>Reply</i></a></div><br/>';
		}
	} else {
		document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment">No comments</div>';
	}
	document.getElementById("commentbutton").onclick = function (evt) {
		if (!pushed) {
			postcomment(id);
		}
	}
	document.getElementById("editlink").onclick = function (evt) {
	document.location.href = "editpost.html?id=" + id;
	}
	document.getElementById("viewattachment").onclick = function (evt) {
		getAttach(stuff["attachment"]);
	}
}
