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
    <input type="button" id="displayHelpButton" value="?" onclick="displayHelp()">
  </div>
  <div id="queueContainer" onmouseleave="queueContainerLeave()">
    <div id="queue"></div>
  </div>
</div>
<div id="stage"></div>
</div>
<div id="help" onclick="displayHelp()">
<div>j - previous song</div>
<div>k - next song</div>
<div>o - set song</div>
<div>d - delete song</div>
<div>n - lower song</div>
<div>p - raise song</div>
<div>space - play/pause</div>
<div>? - display help</div>
</div>

</body>
</html>