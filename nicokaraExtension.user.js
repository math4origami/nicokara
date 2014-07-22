console.log("hello world");

var xmlRequest = new XMLHttpRequest();
xmlRequest.open("GET", "http://flapi.nicovideo.jp/api/getflv/sm9", false);
xmlRequest.send();
console.log(xmlRequest.responseText);