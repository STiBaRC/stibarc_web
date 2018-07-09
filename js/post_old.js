var senderr = function(err) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("post", "https://api.stibarc.gq/senderror.sjs");
  xmlHttp.send("error="+err);
}

var pushed = false;
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

var getRank = function() {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/getuser.sjs?id=" + window.localStorage.getItem("username"), false);
	thing.send(null);
	var stuff = thing.responseText;
	var tmp = stuff.split("\n");
	var rank = tmp[4].split(":")[1];
	return rank;
}

var postcomment = function (id) {
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
			thing.open("POST", "https://api.stibarc.gq/newcomment.sjs", false);
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

var getAttach = function(id) {
	document.getElementById("viewattachment").style.display = "none";
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.stibarc.gq/getimage.sjs?id="+id, false);
	xmlHttp.send(null);
	document.getElementById("image").src = xmlHttp.responseText;
	document.getElementById("image").style.display = "";
}

var checkVerified = function(poster) {
	var thing = new XMLHttpRequest();
	thing.open("GET", "https://api.stibarc.gq/checkverify.sjs?id=" + poster, false);
	thing.send(null);
	var stuff = thing.responseText.split("\n")[0];
	if (stuff == "true") {
		document.getElementById("verified").style.display = "";
	}
}

window.onload = function () {
	try {
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
    xmlHttp.open("GET", "https://api.stibarc.gq/getpost.sjs?id="+id, false);
    xmlHttp.send(null);
    var stuff = JSON.parse(xmlHttp.responseText);
    document.getElementById("title").innerHTML = stuff.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    document.title = stuff.title + " - STiBaRC";
    document.getElementById("dateandstuff").innerHTML = 'Posted by <a href="user.html?id=' + stuff.poster + '">' + stuff.poster + '</a><span id="verified" title="Verified user" style="display:none">'+"✔️</span> at " + stuff.postdate;
    checkVerified(stuff.poster);
    document.getElementById("content").innerHTML = stuff.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
    if (stuff['edited'] == true) {
        document.getElementById("edited").style.display = "";
    }
    if (stuff.poster == window.localStorage.getItem("username") && getRank() != "User") {
        document.getElementById("editlink").style.display = "";
    }
    if (stuff["attachment"] != "none" && stuff["attachment"] != undefined && stuff["attachment"] != null) {
        document.getElementById("attachment").style.display = "";
    }
    xmlHttp.open("GET", "https://api.stibarc.gq/getcomments.sjs?id=" + id, false);
    xmlHttp.send(null);
    if (xmlHttp.responseText != "undefined\n") {
        var comments = JSON.parse(xmlHttp.responseText);
        for (var key in comments) {
            document.getElementById("comments").innerHTML = document.getElementById("comments").innerHTML + '<div id="comment"><a href="user.html?id=' + comments[key]['poster'] + '">' + comments[key]['poster'] + '</a><br/>' + comments[key]['content'].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>") + '</div><br/>';
        }
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
    document.getElementById("viewattachment").onclick = function (evt) {
        getAttach(stuff["attachment"]);
    }
	} catch(err) {
		senderr(err);
	}
}
