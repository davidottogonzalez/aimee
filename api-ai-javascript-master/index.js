var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.sendFile(  __dirname + "/demo/" + "index.html" );
});

app.use(express.static(path.join(__dirname, '/demo/js')));

app.listen(3000, function () {

  console.log('Example app listening on port 3000!');
});