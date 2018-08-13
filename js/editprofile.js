window.onload = function() {
  var sess = window.localStorage.getItem("sess");
  if (sess != undefined && sess != "") {
    var xhr = new XMLHttpRequest();
    xhr.open("POST","https://api.stibarc.gq/userinfo.sjs",true);
    xhr.send("sess="+sess);
    xhr.onload = function(e) {
      var tmp = JSON.parse(xhr.responseText);
      document.getElementById("name").value = tmp['name'];
      document.getElementById("showname").checked = tmp['displayname'];
      document.getElementById("email").value = tmp['email'];
      document.getElementById("showemail").checked = tmp['displayemail'];
      document.getElementById("birthday").value = tmp['birthday'];
      document.getElementById("showbday").checked = tmp['displaybirthday'];
      document.getElementById("bio").value = tmp['bio'];
      document.getElementById("showbio").checked = tmp['displaybio'];
    }
  } else {
    window.localStorage.removeItem("sess");
    window.location.href = "index.html";
  }
}
