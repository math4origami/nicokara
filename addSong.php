<html>
<head></head>

<body>

<div>
<?php
include_once "mysql.php";

function addSong($name) {
  global $mysqli;

  $result = $mysqli->query("SELECT * FROM queued_song WHERE queue_id=0 ORDER BY queue_index");
  $queue = array();
  $last = -1;
  while ($row = $result->fetch_assoc()) {
    $queue[] = $row;
    if ($row['queue_index'] > $last) {
      $last = $row['queue_index'];
    }
  }

  $result = $mysqli->query("INSERT INTO queued_song (queue_id, queue_index, name)
    VALUES (0, " . ($last + 1) . ", '$name')");
}

if (isset($_GET["address"])) {
  $address = $_GET["address"];
  echo $address;
  
  $parsed = parse_url($address);

  if (isset($parsed["host"]) && isset($parsed["path"]) &&
      strpos($parsed["host"], "nicovideo.jp") !== false) {
    $tags = explode("/", $parsed["path"]);
    $name = $tags[count($tags) - 1];

    if (strpos($name, "sm") !== false) {
      addSong($name);
    }
  }
}

?>
</div>

<div id="bookmark"></div>

<script type="text/javascript">
var link = document.createElement("a");
link.innerHTML = "Add Song";
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
<a href="nicokaraExtension.user.js">Nicokara Extension</a>
</div>

</body>
</html>