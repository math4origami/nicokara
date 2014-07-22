<html>
<head>
<link rel="stylesheet" type="text/css" href="basic.css">
<script type="text/javascript">

function tryClick() {
  console.log("tryClick");

  var click=document.createEvent("MouseEvents");
  click.initMouseEvent("click",true,false,document.defaultView,0,500,500,500,500,false,false,false,false,0,null);
  
  var element = document.getElementsByTagName("embed")[0];
  element.dispatchEvent(click);

  console.log(element);
}

</script>
</head>

<body>
<input type="button" value="Click" onclick="tryClick()">
<script type="text/javascript" src="http://ext.nicovideo.jp/thumb_watch/<?= $_GET["name"]?>?autoplay=1"></script>
</body>
</html>