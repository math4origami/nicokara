function autoload () {
  var nicokaraScenes = document.getElementsByClassName("nicokaraScene");
  var nicokaraTemp = null;
  if (nicokaraScenes.length > 0) {
    var nicokaraScene = nicokaraScenes[0];
    if (nicokaraScene.childNodes.length > 0) {
      return;
    }

    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open("GET", "http://flapi.nicovideo.jp/api/getflv/" + nicokaraScene.id, false);
    xmlRequest.send();
    var tags = xmlRequest.responseText.split("&");
    for (var i=0; i<tags.length; i++) {
      var tag = tags[i].split("=");
      if (tag[0] == "url") {
        var video = document.createElement("video");
        video.src = decodeURIComponent(tag[1]);
        video.autoplay = true;
        video.controls = true;
        video.id = "sceneVideo";
        nicokaraScene.appendChild(video);

        break;
      }
    }
  }
}

function autoadd () {
  var nicokaraAddSong = document.getElementById("nicokaraAddSong");
  if (nicokaraAddSong) {
    chrome.runtime.sendMessage({ url: nicokaraAddSong.href });
    nicokaraAddSong.parentNode.removeChild(nicokaraAddSong);
  }
}

setInterval(autoload, 1000);
setInterval(autoadd, 1000);