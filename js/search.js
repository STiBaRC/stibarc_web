function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];
		var arr = queryString.split('&');
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split('=');
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return '';
			});
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
			paramName = paramName;
			paramValue = paramValue;
			if (obj[paramName]) {
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				if (typeof paramNum === 'undefined') {
					obj[paramName].push(paramValue);
				}
				else {
					obj[paramName][paramNum] = paramValue;
				}
			}
			else {
				obj[paramName] = paramValue;
			}
		}
	}
	return obj;
}

var toLink = function (item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a></li>");
	} catch (err) {
		console.log("Whoops");
	}
}

var toJSON = function(cookie) {
	var output = {};
	cookie.split(/\s*;\s*/).forEach(function (pair) {
		pair = pair.split(/\s*=\s*/);
		output[pair[0]] = pair.splice(1).join('=');
	});
	return output;
}

var search = function() {
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