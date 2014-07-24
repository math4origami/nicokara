
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
      if (callback) {
        callback(xmlHttp.responseText);
      }
      xmlHttp.onreadystatechange = null;
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
}

function getActIndex() {
  if (highlightStage > -1) {
    return highlightStage;
  } else {
    return currentStage;
  }
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
  var changed = false;
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
      changed = true;
    }
  }

  while (serverQueue.length < clientQueue.length) {
    popQueue();
  }

  if (changed) {
    updateButtons();
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
  queueButton.ondblclick = function () {
    queueButtonDblClick(server_i);
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
    var stageFrame = document.getElementById("stageFrame");
    if (stageFrame) {
      var nicokaraScenes = stageFrame.contentDocument.getElementsByClassName("nicokaraScene");
      if (nicokaraScenes.length > 0 && nicokaraScenes[0].id == serverSong.name) {
        return;
      }
    }
    updateStage();
  }
}

function popQueue() {
  var clientSong = clientQueue.pop();
  var clientEntry = document.getElementById("queueEntry_" + clientQueue.length);
  clientEntry.parentNode.removeChild(clientEntry);
}

function refreshStage() {
  if (checkStage()) {
    incrementStage();
  }
}

function checkStage() {
  if (currentStage < 0) {
    return true;
  }

  var stageFrame = document.getElementById("stageFrame");
  if (!stageFrame) {
    return false;
  }

  var sceneVideo = stageFrame.contentDocument.getElementById("sceneVideo");
  if (!sceneVideo) {
    return false;
  }

  var clientSong = clientQueue[currentStage];
  if (sceneVideo.readyState != 4) {
    if (!clientSong.loadedTemp) {
      clientSong.loadedTemp = true;
      clientSong.tempWindow = window.open("http://www.nicovideo.jp/watch/" + clientSong.name, "_blank",
        "width=100, height=100, top=0, left=600");
      clientSong.tempWindow.blur();
      window.focus();
    }

    sceneVideo.load();
    return false;
  } else if (clientSong.tempWindow) {
      clientSong.tempWindow.close();
      clientSong.tempWindow = null;
  }

  if (sceneVideo.ended) {
    return true;
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

  clientSong.loadedTemp = false;
  updateButtons();
}

function updateButtons(dontScroll) {
  var scrollToId = -1;
  var buttons = document.getElementsByClassName("queueButton");
  for (var i=0; i<buttons.length; i++) {
    var queueButton = buttons[i];
    queueButton.className = queueButton.className.replace("queueButtonCurrent", "");
    queueButton.className = queueButton.className.replace("queueButtonHighlight", "");
  }

  if (currentStage > -1) {
    var queueButton = document.getElementById("queueButton_" + currentStage);
    queueButton.className += " queueButtonCurrent";
    scrollToId = currentStage;
  }

  if (highlightStage > -1) {
    var queueButton = document.getElementById("queueButton_" + highlightStage);
    queueButton.className += " queueButtonHighlight";
    scrollToId = highlightStage;

    var currentIdField = document.getElementById("currentIdField");
    currentIdField.value = highlightStage;
  }

  var deleteSongButton = document.getElementById("deleteSongButton");
  var raiseSongButton = document.getElementById("raiseSongButton");
  var lowerSongButton = document.getElementById("lowerSongButton");
  var actIndex = getActIndex();
  deleteSongButton.disabled = actIndex < 0 || actIndex >= clientQueue.length;
  raiseSongButton.disabled = actIndex < 1 || actIndex >= clientQueue.length;
  lowerSongButton.disabled = actIndex < 0 || actIndex >= clientQueue.length-1;

  if (scrollToId > -1 && !dontScroll) {
    var scrollToEntry = document.getElementById("queueEntry_" + scrollToId);
    var queueContainer = document.getElementById("queueContainer");
    var queueHeight = queueContainer.offsetHeight;
    var scrolled = queueContainer.scrollTop;

    var top = scrollToEntry.offsetTop;
    var bottom = top + scrollToEntry.offsetHeight;
    if (top - scrolled < 0) {
      queueContainer.scrollTop = top;
    } else if (bottom - scrolled > queueHeight) {
      queueContainer.scrollTop = bottom - queueHeight;
    }
  }
}

function queueButtonMouseover(index) {
  var currentIdField = document.getElementById("currentIdField");
  currentIdField.value = index;
}

function queueButtonClick(index) {
  highlightStage = index;
  updateButtons();
}

function queueButtonDblClick(index) {
  setCurrent();
}

function queueContainerLeave() {
  var currentIdField = document.getElementById("currentIdField");
  if (highlightStage > -1) {
    currentIdField.value = highlightStage;
  } else if (currentStage > -1) {
    currentIdField.value = currentStage;
  }
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

  highlightStage = field.value;
  updateButtons();

  return false;
}

function setCurrent(dontResetHighlight) {
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
    if (highlightStage == currentStage && !dontResetHighlight) {
      highlightStage = -1;
    }
    updateStage();
  }
}

function deleteSong() {
  var actIndex = getActIndex();
  if (actIndex >= 0 && actIndex < clientQueue.length) {
    httpRequest("actSong.php?act=delete&id=" + clientQueue[actIndex].id, reloadQueue);

    if (currentStage >= highlightStage) {
      currentStage--;
      updateButtons();
    }

    if (highlightStage >= clientQueue.length) {
      highlightStage = clientQueue.length-1;
      updateButtons();
    } 
  }
}

function raiseSong() {
  var actIndex = getActIndex();
  if (actIndex > 0 && actIndex < clientQueue.length) {
    httpRequest("actSong.php?act=raise&id=" + clientQueue[actIndex].id, reloadQueue);

    if (actIndex == highlightStage) {
      highlightStage--;
    }
    if (actIndex == currentStage) {
      currentStage--;
    } else if (actIndex-1 == currentStage) {
      currentStage++;
    }
  }
}

function lowerSong() {
  var actIndex = getActIndex();
  if (actIndex >= 0 && actIndex < clientQueue.length-1) {
    httpRequest("actSong.php?act=lower&id=" + clientQueue[actIndex].id, reloadQueue);

    if (actIndex == highlightStage) {
      highlightStage++;
    }
    if (actIndex == currentStage) {
      currentStage++;
    } else if (actIndex+1 == currentStage) {
      currentStage--;
    }
  }
}

function bodyKeyPress(event) {
  var key = String.fromCharCode(event.charCode);

  if (key == "j" && highlightStage < clientQueue.length-1) {
    highlightStage++;
    updateButtons();
  } else if (key == "k" && highlightStage > 0) {
    highlightStage--;
    updateButtons();
  } else if (key == "d") {
    deleteSong();
  } else if (key == "o") {
    setCurrent(true);
  } else if (key == "n") {
    lowerSong();
  } else if (key == "p") {
    raiseSong();
  } else if (key == " ") {
    var stageFrame = document.getElementById("stageFrame");
    if (stageFrame) {
      var sceneVideo = stageFrame.contentDocument.getElementById("sceneVideo");
      if (sceneVideo) {
        if (sceneVideo.paused) {
          sceneVideo.play();
        } else {
          sceneVideo.pause();
        }
      }
    }
  } else if (key == "?") {
    displayHelp();
  }
}

function displayHelp() {
  var help = document.getElementById("help").style.visibility;
  if (help == "hidden") {
    help = "visible";
  } else {
    help = "hidden";
  }
  document.getElementById("help").style.visibility = help;
}

run(reloadQueue, 1000);
run(refreshStage, 5000);