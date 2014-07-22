<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript" src="theater.js">
</script>

</head>

<body>

<div id="theater">
<div id="sidebar">
  <div id="menu">
    <input type="text" id="currentIdField" onkeypress="return updateCurrentField(this, event);">
    <input type="button" id="currentIdButton" value="Set" onclick="setCurrent()">
  </div>
  <div id="queueContainer">
    <div id="queue"></div>
  </div>
</div>
<div id="stage"></div>
</div>

</body>
</html>