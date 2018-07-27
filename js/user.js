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
		document.getElementById("posts").innerHTML = document.getElementById("posts").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
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
	thing.open("GET", "https://api.stibarc.gq/getuser.sjs?id=" + id, false);
	thing.send(null);
	var stuff = thing.responseText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var tmp = stuff.split("\n");
	var rank = tmp[4].split(":")[1];
	var name = tmp[0].split(":")[1];
	var email = tmp[1].split(":")[1];
	//var posts = tmp[2].split(":")[1];
	var birthday = tmp[3].split(":")[1];
	document.getElementById("username").innerHTML = id.concat('<span id="verified" title="Verified user" style="display:none">✔️</span>');
	document.getElementById("rank").innerHTML = "Rank: ".concat(rank);
	document.getElementById("name").innerHTML = "Real name: ".concat(name);
	if (email != "Not shown" && email != "Not set") {
		document.getElementById("email").innerHTML = "Email: ".concat("<a href=\"mailto:" + email + "\">" + email + "</a>");
	} else {
		document.getElementById("email").innerHTML = "Email: ".concat(email);
	}
	document.getElementById("bday").innerHTML = "Birthday: ".concat(birthday);
	//posts = posts.split(",");
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
