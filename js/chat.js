var togglechat = function() {
	if (document.getElementById("messenger") == null && document.getElementById("messenger") == undefined) {
		var iframe = document.createElement("IFRAME");
		iframe.id = "messenger";
		iframe.src = "https://messenger.stibarc.gq/";
		document.getElementById("chatframe").appendChild(iframe);
	} else {
		if (document.getElementById("messenger").style.display == "none") {
			document.getElementById("messenger").style.display = "";
		} else {
			document.getElementById("messenger").style.display = "none"
		}
	}
}