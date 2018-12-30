/*var toLink = function (item) {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/gettitle.sjs?id=" + item, false);
	thing.send(null);
	var title = thing.responseText;
	try {
		document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML.concat('<li><a href="post.html?id=').concat(item).concat('">').concat(title).concat("</a></li>");
	} catch (err) {
		console.log("Whoops");
	}
}*/

function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
	} catch (err) {
		console.log("Whoops");
	}
}

function getPosts(id) {
	var tmp = new XMLHttpRequest();
	tmp.open("GET", "https://api.stibarc.gq/getuserposts.sjs?id="+id, false);
	tmp.send(null);
	tmp = tmp.responseText.split("\n");
	for (i = 0; i < tmp.length - 1; i++) {
		toLink(tmp[i]);
	}
}

function getStuff(id) {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/v2/getuser.sjs?id=" + id, false);
	thing.send(null);
	var tmp = JSON.parse(thing.responseText);
	var rank = tmp['rank'];
	var name = tmp['name'];
	var email = tmp['email'];
	//var posts = tmp['posts'];
	var birthday = tmp['birthday'];
	document.getElementById("username").innerHTML = id.concat('<span id="verified" title="Verified user" style="display:none">✔️</span>');
	document.getElementById("rank").innerHTML = "Rank: ".concat(rank);
	document.getElementById("name").innerHTML = "Real name: ".concat(name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
	if (email != "Not shown" && email != "Not set") {
		document.getElementById("email").innerHTML = "Email: ".concat("<a href=\"mailto:" + email + "\">" + email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</a>");
	} else {
		document.getElementById("email").innerHTML = "Email: ".concat(email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
	}
	document.getElementById("bday").innerHTML = "Birthday: ".concat(birthday.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
	//posts = posts.split(",");
	document.getElementById("pfp").src = tmp['pfp'];
	document.getElementById("posts").innerHTML = "";
	getPosts(id);		
	var showbio = false;
	var bio = "";
	document.getElementById("biobio").innerHTML = "";
	if (tmp[5] != undefined && tmp[5] != "") {
		showbio = true;
		for (i = 6; i < tmp.length-1; i++) {
			bio = bio + tmp[i]+"<br/>";
		}
		bio = bio+tmp[tmp.length-1];
	}
	if (showbio) {
		document.getElementById("bio").style.display = "";
		document.getElementById("biobio").innerHTML = bio;
	} else {
		document.getElementById("bio").style.display = "none";
	}
}

window.onload = function () {
	var id = getAllUrlParams().id;
	//var cookie = toJSON(document.cookie);
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	setTimeout(function() {getStuff(id); checkVerified(id);}, 10);
}
