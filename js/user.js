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
	thing.open("GET", "https://api.stibarc.gq/v3/getuser.sjs?id=" + id, false);
	thing.send(null);
	var tmp = JSON.parse(thing.responseText);
	var rank = tmp['rank'];
	var name = tmp['name'];
	var email = tmp['email'];
	//var posts = tmp['posts'];
	var birthday = tmp['birthday'];
	document.getElementById("username").innerHTML = id.concat('<span id="verified" title="Verified user" style="display:non✔️</span>');
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
	document.getElementById("followers").innerText = "Followers: "+tmp.followers.length;
	document.getElementById("following").innerText = "Following: "+tmp.following.length;
	if (localStorage.username != undefined && localStorage.sess != undefined) {
		if (tmp.followers.indexOf(localStorage.username) != -1) {
			document.getElementById("follow").innerText = "Following";
			document.getElementById("follow").onclick = function(e) {
				var xhrf = new XMLHttpRequest();
				xhrf.open("POST", "https://api.stibarc.gq/v3/unfollow.sjs", false);
				xhrf.send("sess="+localStorage.sess+"&id="+encodeURIComponent(id));
				location.reload();
			}
		} else {
			document.getElementById("follow").onclick = function(e) {
				var xhrf = new XMLHttpRequest();
				xhrf.open("POST", "https://api.stibarc.gq/v3/follow.sjs", false);
				xhrf.send("sess="+localStorage.sess+"&id="+encodeURIComponent(id));
				location.reload();
			}
		}
	}
	document.getElementById("posts").innerHTML = "";
	getPosts(id);
	var showbio = false;
	var bio = "";
	document.getElementById("biobio").innerHTML = "";
	if (tmp['bio'] != undefined && tmp['bio'] != "") {
		bio = tmp['bio'].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
		showbio = true;
	}
	if (showbio) {
		document.getElementById("bio").style.display = "";
		document.getElementById("biobio").innerHTML = bio;
	} else {
		document.getElementById("bio").style.display = "none";
	}
	if (tmp.keybase != undefined) {
		document.getElementById("bio").style.display = "";
		document.getElementById("biobio").innerHTML = document.getElementById("biobio").innerHTML+"<br/>"
		for (var sig in tmp.keybase) {
			document.getElementById("biobio").innerHTML = document.getElementById("biobio").innerHTML + '<br/>'+tmp.keybase[sig]["kb_username"]+' on Keybase: <a href="https://keybase.io/'+tmp.keybase[sig]["kb_username"]+'/sigs/'+tmp.keybase[sig]['sig_hash']+'"><img alt="Keybase proof status" src="https://keybase.io/'+tmp.keybase[sig]["kb_username"]+'/proof_badge/'+tmp.keybase[sig]['sig_hash']+'?domain=stibarc.gq&username='+getAllUrlParams().id+'"></a>'
		}
	}
	doneLoading();
}

function doneLoading() {
    document.getElementById("load").style.display = "none";
    document.getElementById("page").style.display = "";
}

window.onload = function () {
    var id = getAllUrlParams().id;
    document.title = id + " - STiBaRC";
	var id = getAllUrlParams().id;
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	setTimeout(function() {getStuff(id); checkVerified(id);}, 10);
}
