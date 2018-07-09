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
		document.getElementById("shitlist").innerHTML = document.getElementById("shitlist").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1]).concat("</a></li>");

	} catch (err) {
		console.log("Whoops");
	}
}

var toJSON = function (cookie) {
	var output = {};
	cookie.split(/\s*;\s*/).forEach(function (pair) {
		pair = pair.split(/\s*=\s*/);
		output[pair[0]] = pair.splice(1).join('=');
	});
	return output;
}

var post = function () {
	var content = document.getElementById("content").value;
	var title = document.getElementById("title").value;
	var sess = window.localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (content != "" && content != undefined && title != "" && title != undefined) {
		var thing = new XMLHttpRequest();
		thing.open("POST", "https://api.stibarc.gq/editpost.sjs", false);
		thing.send("sess="+sess+"&id="+id+"&title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
		location.href = "post.html?id=" + id;
		document.getElementById("content").value = "";
		document.getElementById("title").value = "";
	}
}

window.onload = function () {
	var id = getAllUrlParams().id;
	if (id != "" && id != undefined) {
		var thing = new XMLHttpRequest();
		thing.open("GET", "https://api.stibarc.gq/getpost.sjs?id="+id, false);
		thing.send(null);
		var tmp = JSON.parse(thing.responseText);
		document.getElementById("title").value = tmp['title'];
		document.getElementById("content").value = tmp['content'];
		document.getElementById("send").onclick = function (evt) {
			post();
		}
	}
}