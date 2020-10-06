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
	thing.open("GET", "https://api.stibarc.com/getuser.sjs?id=" + window.localStorage.getItem("username"), false);
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
			thing.open("POST", "https://api.stibarc.com/newcomment.sjs", false);
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

function getAttach(stuff) {
	var images = ["png","jpg","gif","webp","svg"];
	var videos = ["mov","mp4","m4a","webm"];
	var audio = ["spx","m3a","wma","wav","mp3"];
	document.getElementById("viewattachment").style.display = "none";
	if (stuff['real_attachment'] != undefined && stuff['real_attachment'] != "" && stuff['real_attachment'] != "none") {
		var ext = stuff['real_attachment'].split(".")[1];
		if (images.indexOf(ext) != -1) {
			var img = document.createElement("IMG");
			img.setAttribute("id", "image");
			img.setAttribute("src", "https://cdn.stibarc.com/images/"+stuff['real_attachment']);
			document.getElementById("attachment").appendChild(img);
		} else if (videos.indexOf(ext) != -1) {
			var video = document.createElement("VIDEO");
			video.setAttribute("controls", null);
			video.setAttribute("autoplay", null);
			video.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+stuff['real_attachment']);
			video.appendChild(source);
			document.getElementById("attachment").appendChild(video);
		} else if (audio.indexOf(ext) != -1) {
			var audio = document.createElement("AUDIO");
			audio.setAttribute("controls", null);
			audio.setAttribute("autoplay", null);
			audio.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+stuff['real_attachment']);
			audio.appendChild(source);
			document.getElementById("attachment").appendChild(audio);
		} else {
			document.getElementById("viewattachment").style.display = "";
			window.open("https://cdn.stibarc.com/images/"+stuff['real_attachment']);
		}
	} else {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", "https://api.stibarc.com/getimage.sjs?id="+id, false);
		xmlHttp.send();
		if (xmlHttp.responseText.substring(5,10) == "image") {
			var img = document.createElement("IMG");
			img.setAttribute("id", "image");
			img.setAttribute("src", xmlHttp.responseText);
			document.getElementById("attachment").appendChild(img);
		} else if (xmlHttp.responseText.substring(5,10) == "video" || xmlHttp.responseText.substring(5,20) == "application/mp4") {
			var video = document.createElement("VIDEO");
			video.setAttribute("controls", null);
			video.setAttribute("autoplay", null);
			video.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", xmlHttp.responseText);
			video.appendChild(source);
			document.getElementById("attachment").appendChild(video);
		} else if (xmlHttp.responseText.substring(5,10) == "audio" || xmlHttp.responseText.substring(5,20) == "application/mp3" || xmlHttp.responseText.substring(5,20) == "application/wav") {
			var audio = document.createElement("AUDIO");
			audio.setAttribute("controls", null);
			audio.setAttribute("autoplay", null);
			audio.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", xmlHttp.responseText);
			audio.appendChild(source);
			document.getElementById("attachment").appendChild(audio);
		} else {
			document.getElementById("viewattachment").style.display = "";
			window.open(xmlHttp.responseText);
		}
		var tmp = xmlHttp.responseText.split("");
	}
}

function replyto(guy) {
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		document.getElementById("comtent").value = document.getElementById("comtent").value + "@" + guy + " ";
		document.getElementById("comtent").focus();
	} else {
		location.href="login.html?redir=post.html%3Fid%3D"+getAllUrlParams().id;
	}
}

function reloadvotes() {
	var id = getAllUrlParams().id;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id="+id, true);
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
		xhr.open("post", "https://api.stibarc.com/upvote.sjs", true);
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
		xhr.open("post", "https://api.stibarc.com/downvote.sjs", true);
		xhr.onload = function(evt) {
			reloadvotes();
		}
		xhr.send("id="+id+"&sess="+sess);
	}
}

function doneLoading() {
    document.getElementById("load").style.display = "none";
    document.getElementById("page").style.display = "";
}

function greenify() {
	var content = document.getElementById("content").innerHTML;
	var tmp = content.split("<br>");
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i].split("")[0] == "&" && tmp[i].split("")[1] == "g" && tmp[i].split("")[2] == "t" && tmp[i].split("")[3] == ";" && tmp[i].split("")[4] != " ") {
			console.log(i);
			tmp[i] = '<span style="color:green;">'+tmp[i]+"</span>"
		}
	}
	document.getElementById("content").innerHTML = tmp.join("<br>");
}

window.onload = function () {
	if (localStorage.showpfps == undefined) {
		localStorage.showpfps = "true";
	}
	if (localStorage.noads == "true") {
		document.getElementById("ads").style.display = "none";
	}
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
	xmlHttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id="+id, false);
	xmlHttp.send(null);
	var stuff = JSON.parse(xmlHttp.responseText);
	document.getElementById("title").innerHTML = stuff.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	document.title = stuff.title + " - STiBaRC";
	if (localStorage.showpfps == "true") {
		var thing2 = new XMLHttpRequest();
		thing2.open("GET", "https://api.stibarc.com/v2/getuser.sjs?id=" + stuff.poster, false);
		thing2.send(null);
		var tmp2 = JSON.parse(thing2.responseText);
		var posterpfp = tmp2['pfp'];
		document.getElementById("postpfp").src = posterpfp + ' ';
	} else {
		document.getElementById("postpfp").style.display = "none";
		document.getElementById("postname").style.marginLeft = "0px";
	}
	document.getElementById("postname").innerHTML = '<a href="user.html?id=' + stuff.poster + '">' + stuff.poster + '</a><span id="verified" title="Verified user" style="display:none">' + "&#10004;&#65039;</span>";
	document.getElementById("dateandstuff").innerHTML = stuff.postdate;
	checkVerified(stuff.poster);
	if (stuff.poster == "herronjo" || stuff.poster == "DomHupp" || stuff.poster == "Aldeenyo" || stuff.poster == "savaka" || stuff.poster == "alluthus" || stuff.poster == "Bunnbuns" || stuff.poster == "Merkle") {
		document.getElementById("content").innerHTML = stuff.content.replace(/\r\n/g, "<br/>");
	} else {
		document.getElementById("content").innerHTML = stuff.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
	}
	greenify();
	if (stuff['edited'] == true) {
		document.getElementById("edited").style.display = "";
	}
	if (stuff.poster == window.localStorage.username) {
		document.getElementById("editlinkcontainer").style.display = "";
	}
	if (stuff["attachment"] != "none" && stuff["attachment"] != undefined && stuff["attachment"] != null) {
		document.getElementById("attachment").style.display = "";
	}
	document.getElementById("upvotes").innerHTML = stuff['upvotes'];
	document.getElementById("downvotes").innerHTML = stuff['downvotes'];
	xmlHttp.open("GET", "https://api.stibarc.com/getcomments.sjs?id=" + id, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText != "undefined\n") {
		var comments = JSON.parse(xmlHttp.responseText);
		var commentsHTML = '';
		for (var key in comments) {
			var image = "";
			if (localStorage.showpfps == "true") {
				image = '<img src="' + comments[key].pfp + '"style="width:48px;height:48px;border-radius:50%;vertical-align:middle;margin-right:5px;" />';
			}
			commentsHTML += '<div id="comment"><a class="comment-username" href="user.html?id=' + comments[key]['poster'] + '">'+image+comments[key]['poster'].replace(/&/g, "&amp;") + '</a>' + comments[key]['content'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>") + '<br/><a class="replyto" href="javascript:replyto('+"'"+comments[key]['poster']+"'"+')"><i>Reply</i></a></div><br/>';
		}
		document.getElementById('comments').innerHTML = '<h4>Comments:</h4>'+commentsHTML;
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
	if (stuff.client != undefined) {
		document.getElementById("client").innerHTML = "<i>Posted using "+stuff.client+"</i>";
		document.getElementById("client").style.display = "";
	}
	document.getElementById("viewattachment").onclick = function (evt) {
		getAttach(stuff);
	}
	doneLoading();
}
