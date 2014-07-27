<html>
<head>
<script type="text/javascript">
var address = window.location.origin + window.location.pathname;
address = address.replace("index.php", "");
</script>
</head>

<body>
<div><h1>Nicokara</h1></div>

<div id="theater" style="margin-bottom:20;">Go to <a href="theater.php">Theater</a></div>

<div id="bookmark">Bookmarklet: </div>
<script type="text/javascript">
var link = document.createElement("a");
link.innerHTML = "Nicokara Add Song";
link.href = "javascript:(function() { \
  var bookmark = document.createElement('script'); \
  bookmark.src = '" + address + "addSong.php?'; \
  var damData = document.getElementsByClassName('nicokaraDamData'); \
  if (damData.length > 0) { \
    bookmark.src += damData[0].id; \
  } else { \
    bookmark.src += 'address=' + encodeURIComponent(window.location.origin + window.location.pathname); \
  } \
  document.body.appendChild(bookmark); \
})();";

var bookmark = document.getElementById("bookmark");
bookmark.appendChild(link);
</script>

<div>
Extension/script: <a href="extension.crx">Nicokara Extension</a>
</div>

<div><h2>Local version</h2></div>
<div id="theater" >Go to <a href="theater.php?local=1">Theater</a></div>
<div id="theater" style="margin-bottom:20;">Go to <a href="webSql.html">Local SQL</a></div>

<div id="localBookmark">Bookmarklet: </div>
<script type="text/javascript">
var link = document.createElement("a");
link.innerHTML = "Local Add Song";
link.href = "javascript:(function() { \
  var localPage = document.createElement('a'); \
  localPage.href = '" + address + "addSong.html?'; \
  var damData = document.getElementsByClassName('nicokaraDamData'); \
  if (damData.length > 0) { \
    localPage.href += damData[0].id; \
  } else { \
    localPage.href += 'address=' + encodeURIComponent(window.location.origin + window.location.pathname); \
  } \
  localPage.id = 'nicokaraAddSong'; \
  document.body.appendChild(localPage);\
})();";

var bookmark = document.getElementById("localBookmark");
bookmark.appendChild(link);
</script>

<div>
Extension/script: <a href="extension.crx">Nicokara Extension</a> (same as above)
</div>

<div style="margin-top:20;">
  2014 Russell Chou <a href="http://www.twitter.com/math4origami/">@math4origami</a>
</div>
</body>
</html>
