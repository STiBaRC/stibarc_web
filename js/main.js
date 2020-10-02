var toLinkHTML = "";

function toLink(id,item) {
	try {
		if (item['deleted']) {item['title'] = "Post deleted"}
		var title = item['title'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        	toLinkHTML += '<div class="post"><a class="overlay" style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+title+'</b></a><div class="inner" style="margin-top:3px;"><br>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></div></div>';
		lastid = id;
	} catch (err) {
		console.log(err);
	}
}

var toFollowHTML = "";

function toFollowLink(id,item) {
	try {
		if (item['deleted']) {item['title'] = "Post deleted"}
		var title = item['title'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        	toFollowHTML += '<div class="post"><a class="overlay" style="font-size:100%;text-decoration:none;" href="post.html?id='+id+'"><b>'+title+'</b></a><div class="inner" style="margin-top:3px;"><br>Posted by: <a href="user.html?id='+item['poster']+'">'+item['poster']+'</a><br>&#8679; '+item['upvotes']+' &#8681; '+item['downvotes']+'</a></div></div>';
		lastfollowid = id;
	} catch (err) {
		console.log(err);
	}
}

function getAnnounce() {
	var sess = window.localStorage.getItem("sess");
	var xhr = new XMLHttpRequest();
	xhr.open("GET","https://api.stibarc.com/getannounce.sjs?sess="+sess,true);
	xhr.send(null);
	xhr.onload = function(e) {
		if (xhr.responseText.trim() != "") {
			try {var tmp = JSON.parse(xhr.responseText);} catch(err) {}
			document.getElementsByTagName("body")[0].innerHTML = '<div id="announce" style="text-align:center;background-color:#49B9CA;word-wrap:break-word;padding:15px;border-radius:15px;"><h2>'+tmp['title']+'</h2>'+tmp['content']+'</div>' + document.getElementsByTagName("body")[0].innerHTML;
		}
		document.getElementById("loadmore").onclick = function(evt) {
			loadMore();
		}
		document.getElementById("followloadmore").onclick = function(evt) {
			loadMoreFollow();
		}
		document.getElementById("global").onclick = function(evt) {
			document.getElementById("mainblobwithlist").style.display = "";
			document.getElementById("followblob").style.display = "none";
			document.getElementById("global").className = "unsel";
			document.getElementById("followed").className = "sel";
		}
		document.getElementById("followed").onclick = function(evt) {
			document.getElementById("mainblobwithlist").style.display = "none";
			document.getElementById("followblob").style.display = "";
			document.getElementById("followed").className = "unsel";
			document.getElementById("global").className = "sel";
		}
	}
}

function checkSess() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.com/checksess.sjs?sess="+sess, false);
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
	xmlHttp.open("POST", "https://api.stibarc.com/getusername.sjs", false);
	xmlHttp.send("sess="+sess);
	window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var lastid = 1;
var lastfollowid = 1;

function loadMore() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs?id="+lastid, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.trim() != "") {
		var tmp = JSON.parse(xmlHttp.responseText);
		var tmp2 = lastid-1;
		for (var i = tmp2; i > tmp2-20; i--) {
			toLink(i,tmp[i]);
		}
		document.getElementById("list").innerHTML = toLinkHTML;
	} else {
		document.getElementById("loadmorecontainer").style.display = "none";
	}
}

function loadMoreFollow() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.com/v3/getfollowposts.sjs?sess="+localStorage.sess+"&id="+lastfollowid, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.trim() != "No posts") {
		var tmp = JSON.parse(xmlHttp.responseText);
		var tmp2 = [];
		for (var i in tmp) {
			tmp2.push(i);
		}
		for (var i = tmp2.length-1; i >= 0; i--) {
			toFollowLink(tmp2[i],tmp[tmp2[i]]);
		}
		document.getElementById("followlist").innerHTML = toFollowHTML;
	} else {
		document.getElementById("followloadmorecontainer").style.display = "none";
	}
}

function doneLoading() {
    document.getElementById("load").style.display = "none";
    document.getElementById("page").style.display = "";
}

window.onload = function () {
	if (localStorage.noads == "true") {
		document.getElementById("ads").style.display = "none";
	}
	var offline = false;
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != null && sess != "") {
		checkSess();
		document.getElementById("loggedout").style.display = "none";
		document.getElementById("loggedin").style.display = "";
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", false);
	try {
		xmlHttp.send(null);
	} catch (err) {
		offline = true;
	}
	if (!offline) {
		getAnnounce();
		if (window.localStorage.getItem("username") == "" || window.localStorage.getItem("username") == undefined) {
			if (sess != undefined && sess != null && sess != "") {
				getUsername();
			}
		}
		var tmp = JSON.parse(xmlHttp.responseText);
		document.getElementById("list").innerHTML = "";
		for (var i = tmp['totalposts']; i > tmp['totalposts']-20; i--) {
			toLink(i,tmp[i]);
        	}
		document.getElementById("list").innerHTML = toLinkHTML;
		document.getElementById("loadmorecontainer").style.display = "";
		if (sess != undefined && sess != null && sess != "") {
			var xhr = new XMLHttpRequest();
			xhr.open("get", "https://api.stibarc.com/v3/getfollowposts.sjs?sess="+sess, false);
			xhr.send(null);
			if (xhr.responseText != "No posts\n") {
				var followtmp = JSON.parse(xhr.responseText);
				document.getElementById("followlist").innerHTML = "";
				var tmpposts = [];
				for (var key in followtmp) {
					tmpposts.push(key);
				}
				for (var i = tmpposts.length-1; i >= 0; i--) {
					toFollowLink(tmpposts[i], followtmp[tmpposts[i]]);
				}
				document.getElementById("followloadmorecontainer").style.display = "";
			} else {
				document.getElementById("followlist").innerHTML = "It looks like you aren't following anyone, or nobody has posted anything.<br/><br/>";
			}
		}
	} else {
		document.getElementById("list").innerHTML = "Error loading posts. Device offline.";
	}
	doneLoading();
	startNotifs();
}
