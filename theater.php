<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript" src="theater.js">
</script>

</head>

<body>
<div id="theater">
<div id="theater_row">
<div id="sidebar">
  <div id="menu">
    <input type="text" id="currentIdField" onkeypress="return updateCurrentField(this, event);">
    <input type="button" id="currentIdButton" value="Set" onclick="setCurrent()">
  </div>
  <div id="queue"></div>
</div>
<div id="stage"></div>


</div>
</div>
</body>
</html>