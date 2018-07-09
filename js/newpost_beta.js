var attachedfile = "none";

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
	//var cookie = toJSON(document.cookie);
	//var sess = cookie.sess;
	var sess = window.localStorage.getItem("sess");
	var again = window.localStorage.getItem("canpostagain");
	if (again == null || again == "" || again == undefined) again = 0;
	if (content.trim() != "" && content != undefined && title.trim() != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			var n = new Date().getTime() + 15000;
			window.localStorage.setItem("canpostagain", n);
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.gq/postpost.sjs", false);
			thing.send("sess="+sess+"&title="+encodeURIComponent(title)+"&image="+attachedfile+"&content="+encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
			location.href = "post.html?id=" + thing.responseText;
			document.getElementById("content").value = "";
			document.getElementById("title").value = "";
			attachedfile = "";
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			document.getElementById("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			document.getElementById("wait").style.display = "";
		}
	}
}

var bad = false;
var first = true;
var filename = "";

var allgood = new CustomEvent("allgood", {detail:{state:"good"}});

var startUpload = function(stuff, callback) {
	var totalParts = stuff.length;
	var i = 0;
	uploadPart("undefined",stuff[i]);
	document.addEventListener('allgood', function(e){
		if (!bad && i < totalParts) {
			i++;
			uploadPart(filename,stuff[i]);
			document.getElementById("imageprogress").setAttribute("value",i+1);
		}
	});
	console.log(totalParts);
	if (bad) {
		callback(false)
	} else {
		callback(true);
	}
}

var uploadPart = function(file, part) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", true);
	if (first) {
		xmlHttp.send("content=" + encodeURIComponent(part));
	} else {
		xmlHttp.send("cont=true&file="+file+"&content=" + encodeURIComponent(part));
	}
	xmlHttp.onload = function(e) {
		if (first) {
			if (xmlHttp.responseText.split("\n")[0] != "ERR" && xmlHttp.responseText.split("\n")[0] != "") {
				first = false;
				filename = xmlHttp.responseText.split("\n")[0];
				attachedfile = xmlHttp.responseText;
				document.dispatchEvent(allgood);
			} else {
				var xmlHttp2 = new XMLHttpRequest();
				xmlHttp2.open("POST", "https://api.stibarc.gq/uploadparts.sjs", true);
				xmlHttp2.send("content=" + encodeURIComponent(part));
				xmlHttp2.onload = function(e) {
					if (xmlHttp2.responseText.split("\n")[0] != "ERR" && xmlHttp2.responseText.split("\n")[0] != "") {
						first = false;
						filename = xmlHttp2.responseText.split("\n")[0];
						attachedfile = xmlHttp.responseText;
						document.dispatchEvent(allgood);
					} else {
						bad = true;
						document.dispatchEvent(allgood);
					}
				}
			}
		} else {
			if (xmlHttp.responseText.split("\n")[0] == "GOOD") {
				document.dispatchEvent(allgood);
			} else {
				var xmlHttp2 = new XMLHttpRequest();
				xmlHttp2.open("POST", "https://api.stibarc.gq/uploadparts.sjs", true);
				xmlHttp2.send("cont=true&file="+file+"&content=" + encodeURIComponent(part));
				xmlHttp2.onload = function(e) {
					if (xmlHttp2.responseText.split("\n")[0] == "GOOD") {
						document.dispatchEvent(allgood);
					} else {
						bad = true;
						document.dispatchEvent(allgood);
					}
				}
			}
		}
		console.log(bad);
	}
}

var readFile = function(evt) {
	document.getElementById("send").disabled = true;
	document.getElementById("imageadd").style.display = 'none';
	document.getElementById("pleasewait").style.display = '';
	document.getElementById("error").style.display = "none";
	var f = evt.target.files[0];
		if(f) {
		var r = new FileReader();
		r.onload = function(e) {
			var contents = e.target.result;
			document.getElementById("imageprogress").style.display = '';
			if (contents.length <= 98000) {
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", true);
				xmlHttp.send("content=" + encodeURIComponent(contents));
				document.getElementById("imageprogress").setAttribute("max",1);
				document.getElementById("imageprogress").setAttribute("value",1);
				xmlHttp.onload = function(e) {
					attachedfile = xmlHttp.responseText;
					document.getElementById("send").disabled = false;
					document.getElementById("pleasewait").style.display = 'none';
					document.getElementById("imageprogress").style.display = 'none';
					document.getElementById("imageadded").style.display = '';
				}
			} else {
				bad = false;
				first = true;
				filename = "";
				var xmlHttp = new XMLHttpRequest();
				var stuff = contents.match(/.{1,98000}/g);
				var totalParts = stuff.length;
				document.getElementById("imageprogress").setAttribute("max",totalParts);
				startUpload(stuff, function(state) {
					console.log(state);
					if (!state) {
						document.getElementById("send").disabled = false;
						document.getElementById("pleasewait").style.display = 'none';
						document.getElementById("imageprogress").style.display = 'none';
						document.getElementById("imageadded").style.display = '';
					} else {
						document.getElementById("pleasewait").style.display = 'none';
						document.getElementById("imageprogress").style.display = 'none';
						document.getElementById("imageadd").style.display = "";
						document.getElementById("error").style.display = "";
					}
				});
			}
		}
		r.readAsDataURL(f);
	}
}
window.onload = function () {
	document.getElementById("file").addEventListener('change',readFile,false);
	document.getElementById("removeimage").onclick = function (evt) {
		attachedfile = "none";
		document.getElementById("imageadded").style.display = 'none';
		document.getElementById("imageadd").style.display = '';
	}
	document.getElementById("send").onclick = function (evt) {
		post();
	}
}