
var clientQueue = [];

function removeAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function httpRequest(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState==4 && xmlHttp.status==200) {
      callback(xmlHttp.responseText);
      xmlHttp.onreadystatechange = null;
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function loadStage() {
  console.log("loadStage");

  var platform = document.createElement("iframe");
  platform.src = "scene.php";
  platform.id = "stage";
  platform.scrolling = "no";

  var stage = document.getElementById("stage");
  removeAllChildren(stage);
  stage.appendChild(platform); 

  var upcoming = document.createElement("iframe");
  upcoming.src ="http://ext.nicovideo.jp/thumb/sm17209598";
  upcoming.scrolling = "no";
  upcoming.className = "queue";

  var queue = document.getElementById("queue");
  queue.appendChild(upcoming);
}

function reloadQueue() {
  httpRequest("queue.php", reloadQueueCallback);
}

function reloadQueueCallback(response) {
  var serverQueue = JSON.parse(response);
  for (var server_i in serverQueue) {
    var serverSong = serverQueue[server_i];
    if (serverSong.queue_index == clientQueue.length) {
      addQueue(serverSong);
    } else if (serverSong.queue_index > clientQueue.length) {
      //server queue jumped past client queue, discard
      break;
    }


  }
}

function addQueue(serverSong) {
  
}

reloadQueue();
setInterval(reloadQueue, 5000);