var pfp = "";

function readFile(evt) {
  var f = evt.target.files[0];
  if(f) {
    var r = new FileReader();
    r.onload = function(e) {
      pfp = e.target.result;
    }
    r.readAsDataURL(f);
  }
}

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
      document.getElementById("pfp").addEventListener('change',readFile,false);
    }
  } else {
    window.localStorage.removeItem("sess");
    window.location.href = "index.html";
  }
  document.getElementById("submit").onclick = function(evt) {
    var sess = window.localStorage.getItem("sess");
    var xhr = new XMLHttpRequest();
    xhr.open("POST","https://api.stibarc.gq/updateprofile.sjs",true);
    var showemail = document.getElementById("showemail").checked;
    if (showemail == false) {showemail="";}
    var showname = document.getElementById("showname").checked;
    if (showname == false) {showname="";}
    var showbday = document.getElementById("showbday").checked;
    if (showbday == false) {showbday="";}
    var showbio = document.getElementById("showbio").checked;
    if (showbio == false) {showbio="";}
    if (pfp.trim() != "") {
      var xhr2 = new XMLHttpRequest();
      xhr2.open("POST","https://api.stibarc.gq/updatepfp.sjs",true);
      xhr2.send("sess="+localStorage.sess+"&data="+pfp);
    }
    xhr.send("sess="+sess+"&email="+encodeURIComponent(document.getElementById("email").value)+"&name="+encodeURIComponent(document.getElementById("name").value)+"&birthday="+encodeURIComponent(document.getElementById("birthday").value)+"&bio="+encodeURIComponent(document.getElementById("bio").value)+"&showemail="+showemail+"&showname="+showname+"&showbday="+showbday+"&showbio="+showbio);
    xhr.onload = function(e) {
      window.location.href = "index.html";
    }
  }
}
