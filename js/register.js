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

var toJSON = function (cookie) {
	var output = {};
	cookie.split(/\s*;\s*/).forEach(function (pair) {
		pair = pair.split(/\s*=\s*/);
		output[pair[0]] = pair.splice(1).join('=');
	});
	return output;
}

var register = function () {
	var name = document.getElementById("name").value;
	var showname = document.getElementById("showname").value;
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var password2 = document.getElementById("password2").value;
	var email = document.getElementById("email").value;
	var showemail = document.getElementById("showemail").value;
	var bday = document.getElementById("bday").value;
	var showbday = document.getElementById("showbday").value;
	if (username != "" && username != null && username != undefined && password != "" && password != null && password != undefined && password2 != "" && password2 != null && password2 != undefined) {
		if (password == password2) {
			var thing = new XMLHttpRequest();
			thing.open("POST", "https://api.stibarc.gq/createuser.sjs", false);
			thing.send("username="+username+"&password="+password+"&password2="+password2+"&email="+email+"&showemail="+showemail+"&birthday="+bday+"&showbday="+showbday+"&name="+name);
			if (thing.responseText == "Created\n") {
				location.href = "login.html";
			} else {
				document.getElementById("err").style.display = "";
			}
		} else {
			document.getElementById("pword").style.display = "";
		}
	} else {
		document.getElementById("blank").style.display = "";
	}
}

window.onload = function () {
	document.getElementById("send").onclick = function (evt) {
		register();
	}
}