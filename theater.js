
var clientQueue = [];
var currentStage = -1;
var highlightStage = -1;

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
  var queueEntry = document.createElement("div");
  queueEntry.className = "queueEntry";
  queueEntry.id = "queueEntry_" + server_i;

  var queueButton = document.createElement("div");
  queueButton.className = "queueButton";
  queueButton.id = "queueButton_" + server_i;
  queueButton.onmouseover = function () {
    queueButtonMouseover(server_i);
  };
  queueButton.onclick = function () {
    queueButtonClick(server_i);
  };

  var queueSong = document.createElement("iframe");
  queueSong.src = "http://ext.nicovideo.jp/thumb/" + serverSong.name;
  queueSong.scrolling = "no";
  queueSong.className = "queue";
  queueSong.id = "queue_" + server_i;

  var queue = document.getElementById("queue");
  queueEntry.appendChild(queueButton);
  queueEntry.appendChild(queueSong);
  queue.appendChild(queueEntry);

  clientQueue.push(serverSong);

}
function updateQueue(serverSong, server_i) {
  var clientEntry = document.getElementById("queue_" + server_i);
  clientEntry.src = "http://ext.nicovideo.jp/thumb/" + serverSong.name;

  clientQueue[server_i] = serverSong;
  if (server_i == currentStage) {
    updateStage();
  }
}

function popQueue() {
  var clientSong = clientQueue.pop();
  var clientEntry = document.getElementById("queueEntry_" + clientQueue.length);
  clientEntry.parentNode.removeChild(clientEntry);
}

function refreshStage() {
  if (shouldUpdateStage()) {
    incrementStage();
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

function incrementStage() {
  if (currentStage + 1 >= clientQueue.length) {
    return;
  }
  currentStage++;

  updateStage();
}

function updateStage() {
  if (clientQueue.length <= 0 ||
      currentStage < 0  ||
      currentStage >= clientQueue.length) {
    return;
  } 

  var clientSong = clientQueue[currentStage];

  var scene = document.createElement("iframe");
  scene.src = "scene.php?name=" + clientSong.name;
  scene.id = "stageFrame";
  scene.scrolling = "no";

  var stage = document.getElementById("stage");
  removeAllChildren(stage);
  stage.appendChild(scene);

  var currentIdField = document.getElementById("currentIdField");
  currentIdField.value = currentStage;

  updateButtons();
}

function updateButtons() {
  var buttons = document.getElementsByClassName("queueButton");
  for (var i=0; i<buttons.length; i++) {
    var queueButton = buttons[i];
    queueButton.className = queueButton.className.replace("queueButtonCurrent", "");
    queueButton.className = queueButton.className.replace("queueButtonHighlight", "");
  }

  if (currentStage > -1) {
    var queueButton = document.getElementById("queueButton_" + currentStage);
    queueButton.className += " queueButtonCurrent";
  }
}

function queueButtonMouseover(index) {
  updateButtons();

  var currentIdField = document.getElementById("currentIdField");
  currentIdField.value = index;
}

function queueButtonClick(index) {
  console.log("press "+index);
}

function updateCurrentField(field, event) {
  if (event.keyIdentifier == "Enter") {
    setCurrent();
    return true;
  }
  if (!/\d/.test(String.fromCharCode(event.charCode))) {
    return false;
  }
  
  var newId = parseInt(field.value + String.fromCharCode(event.charCode));
  if (newId < 0 || clientQueue.length <= 0) {
    field.value = 0;
  } else if (newId >= clientQueue.length) {
    field.value = clientQueue.length - 1;
  } else {
    field.value = newId;
  }

  updateButtons();
  var queueButton = document.getElementById("queueButton_" + field.value);
  queueButton.className += " queueButtonHighlight";

  return false;
}

function setCurrent() {
  var currentIdField = document.getElementById("currentIdField");

  var newId = parseInt(currentIdField.value);
  if (newId < 0 || clientQueue.length <= 0) {
    newId = 0;
  } else if (newId >= clientQueue.length) {
    newId = clientQueue.length - 1;
  }
  if (newId != currentIdField.value) {
    currentIdField.value = newId;
  }

  if (clientQueue.length <= 0) {
    currentStage = -1;
  } else {
    currentStage = newId;
    updateStage();
  }
}

run(reloadQueue, 2000);
run(refreshStage, 1000);