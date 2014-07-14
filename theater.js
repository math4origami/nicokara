
var clientQueue = [];
var currentStage = -1;

function removeAllChildren(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function run(callback, interval) {
  callback();
  setInterval(callback, interval);
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
  var platform = document.createElement("iframe");
  platform.src = "scene.php";
  platform.id = "stage";
  platform.scrolling = "no";

  var stage = document.getElementById("stage");
  removeAllChildren(stage);
  stage.appendChild(platform); 

  var upcoming = document.createElement("iframe");
  upcoming.src = "http://ext.nicovideo.jp/thumb/sm17209598";
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
    if (server_i == clientQueue.length) {
      addQueue(serverSong, server_i);
    } else if (server_i > clientQueue.length) {
      console.log("server queue jumped past client queue, discard");
      break;
    }

    var clientSong = clientQueue[server_i];
    if (clientSong.name != serverSong.name) {
      updateQueue(serverSong, server_i);
    }
  }

  while (serverQueue.length < clientQueue.length) {
    popQueue();
  }
}

function addQueue(serverSong, server_i) {
  var queueSong = document.createElement("iframe");
  queueSong.src = "http://ext.nicovideo.jp/thumb/" + serverSong.name;
  queueSong.scrolling = "no";
  queueSong.className = "queue";
  queueSong.id = "queue_" + server_i;

  var queue = document.getElementById("queue");
  queue.appendChild(queueSong);

  clientQueue.push(serverSong);
}

function updateQueue(serverSong, server_i) {
  var clientEntry = document.getElementById("queue_" + server_i);
  clientEntry.src = "http://ext.nicovideo.jp/thumb/" + serverSong.name;

  clientQueue[server_i] = serverSong;
}

function popQueue() {
  var clientSong = clientQueue.pop();
  var clientEntry = document.getElementById("queue_" + clientQueue.length);
  clientEntry.parentNode.removeChild(clientEntry);
}

function refreshStage() {
  if (shouldUpdateStage()) {
    updateStage();
  }
}

function shouldUpdateStage() {
  if (currentStage < 0) {
    return true;
  }

  var stageFrame = document.getElementById("stageFrame");
  if (!stageFrame) {
    return false;
  }

  try {
    var status = stageFrame.contentDocument.getElementsByTagName("embed")[0].ext_getStatus();
    if (status == "end") {
      return true;
    }
  } catch (error) {
    //not loaded
  }

  return false;
}

function updateStage() {
  if (currentStage + 1 >= clientQueue.length) {
    return;
  }

  currentStage++;
  var clientSong = clientQueue[currentStage];

  var scene = document.createElement("iframe");
  scene.src = "scene.php?name=" + clientSong.name;
  scene.id = "stageFrame";
  scene.scrolling = "no";

  var stage = document.getElementById("stage");
  removeAllChildren(stage);
  stage.appendChild(scene);
}

run(reloadQueue, 2000);
run(refreshStage, 1000);