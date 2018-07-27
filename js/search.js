function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
	} catch (err) {
		console.log("Whoops");
	}
}

function toJSON(cookie) {
	var output = {};
	cookie.split(/\s*;\s*/).forEach(function (pair) {
		pair = pair.split(/\s*=\s*/);
		output[pair[0]] = pair.splice(1).join('=');
	});
	return output;
}

function search() {
	var q = document.getElementById("q").value;
	if (q != "") {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("post", "https://api.stibarc.gq/postsearch.sjs", false);
		xmlHttp.send("q="+q);
		if (xmlHttp.responseText.split("\n")[0] != "No results" && xmlHttp.responseText != "") {
			var tmp = xmlHttp.responseText.split("\n");
			document.getElementById("list").innerHTML = "";
			for (i = 0; i < tmp.length - 1; i++) {
				toLink(tmp[i]);
			}
		} else {
			document.getElementById("list").innerHTML = "<li>No results</li>"
		}
		document.getElementById("main2").style.display = "";
	}
}

window.onload = function () {
	var sess = window.localStorage.getItem("sess");
	if (sess != undefined && sess != null && sess != "") {
		document.getElementById("footerout").style.display = "none";
		document.getElementById("footerin").style.display = "";
	}
	document.getElementById("searchbutton").onclick = function (evt) {
		search();
	}
	document.getElementById("q").addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			search();
		}
	});
}