<html>
<head></head>

<body>
<div><h1>Nicokara</h1></div>
<div id="theater" style="margin-bottom:20;">Go to <a href="theater.php">Theater</a></div>
<div id="bookmark">Bookmarklet: </div>

<script type="text/javascript">
var link = document.createElement("a");
link.innerHTML = "Nicokara Add Song";
link.href = "javascript:(function() { \
  var bookmark = document.createElement('script'); \
  bookmark.src = '" + window.location.origin + window.location.pathname + "?address=' + \
    encodeURIComponent(window.location.origin + window.location.pathname); \
  document.body.appendChild(bookmark); \
})();";

var bookmark = document.getElementById("bookmark");
bookmark.appendChild(link);
</script>

<div>
Extension/script: <a href="nicokaraExtension.user.js">Nicokara Extension</a>
</div>
<div style="margin-top:20;">2014 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a></div>
</body>
</html>