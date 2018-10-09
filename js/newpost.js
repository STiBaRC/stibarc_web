var attachedfile = "none";

function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		document.getElementById("list").innerHTML = document.getElementById("list").innerHTML.concat('<li><a href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1]).concat("</a></li>");

	} catch (err) {
		console.log("Whoops");
	}
}

function post() {
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

function uploadPart(file,part,callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
	xmlHttp.send("cont=true&file="+file+"&content=" + encodeURIComponent(part));
	try {
		if (xmlHttp.responseText.split("\n")[0] == "GOOD") {
			callback("Good");
		} else {
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
			xmlHttp.send("cont=true&file="+file+"&content=" + encodeURIComponent(part));
			try {
				if (xmlHttp.responseText.split("\n")[0] == "GOOD") {
					callback("Good");
				} else {
					callback("Error");
				}
			} catch(err) {
				callback("Error");
			}
		}
	} catch(err) {
		callback("Error");
	}
}

function readFile(evt) {
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
				console.log("Good");
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
				xmlHttp.send("content=" + encodeURIComponent(contents));
				document.getElementById("imageprogress").setAttribute("max",1);
				document.getElementById("imageprogress").setAttribute("value",1);
				attachedfile = xmlHttp.responseText;
				document.getElementById("pleasewait").style.display = 'none';
				document.getElementById("imageprogress").style.display = 'none';
				document.getElementById("imageadded").style.display = '';
			} else {
				var bad = false;
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
				var stuff = contents.match(/.{1,98000}/g);
				var totalParts = stuff.length;
				document.getElementById("imageprogress").setAttribute("max",totalParts);
				xmlHttp.send("content=" + encodeURIComponent(stuff[0]));
				var file = xmlHttp.responseText.split("\n")[0];
				if (xmlHttp.responseText.split("\n")[0] != "ERR" && xmlHttp.responseText.split("\n")[0] != "") {
					bad = false;
				} else {
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("POST", "https://api.stibarc.gq/uploadparts.sjs", false);
					xmlHttp.send("content=" + encodeURIComponent(stuff[0]));
					var file = xmlHttp.responseText.split("\n")[0];
					if (xmlHttp.responseText.split("\n")[0] == "GOOD") {
						bad = false;
					} else {
						bad = true;
					}
				}
				if (bad == false) {
					console.log(file);
					document.getElementById("imageprogress").setAttribute("value",1);
					for (var i = 1; i < stuff.length; i++) {
						if (bad == false) {
							uploadPart(file,stuff[i],function(msg) {
								if ((msg) == "Error") {
									console.log("bad");
									bad = true;
								}
								console.log((i+1)+"/"+stuff.length);
							});
							document.getElementById("imageprogress").setAttribute("value",(i+1));
						}
					}
					if (bad == false) {
						attachedfile = file;
					} else {
						document.getElementById("imageadd").style.display = "";
						document.getElementById("error").style.display = "";
					}
				} else {
					document.getElementById("imageadd").style.display = "";
					document.getElementById("error").style.display = "";
				}
			}
			if (bad == false) {
				document.getElementById("pleasewait").style.display = 'none';
				document.getElementById("imageprogress").style.display = 'none';
				document.getElementById("imageadded").style.display = '';
			}
		}
		r.readAsDataURL(f);
	}
	document.getElementById("send").disabled = false;
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