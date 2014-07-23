<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript" src="theater.js">
</script>

</head>

<body onkeypress="return bodyKeyPress(event);">

<div id="theater">
<div id="sidebar">
  <div id="menu">
    <input type="text" id="currentIdField" onkeypress="return updateCurrentField(this, event);">
    <input type="button" id="currentIdButton" value="Set" onclick="setCurrent()">
    <input type="button" id="deleteSongButton" value="X" onclick="deleteSong()">
    <input type="button" id="raiseSongButton" value="/\" onclick="raiseSong()">
    <input type="button" id="lowerSongButton" value="V" onclick="lowerSong()">
  </div>
  <div id="queueContainer" onmouseleave="queueContainerLeave()">
    <div id="queue"></div>
  </div>
</div>
<div id="stage"></div>
</div>

</body>
</html>