var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
<<<<<<< HEAD
  res.sendFile(  __dirname + "/demo/" + "index.html" );
=======
  res.sendFile(__dirname + "/demo/index.html" );
});

app.get('/index2', function (req, res) {
  res.sendFile(__dirname + "/demo/index2.html" );
>>>>>>> origin/master
});

app.get('/index3', function (req, res) {
  res.sendFile(__dirname + "/demo/index3.html" );
});


app.use(express.static(path.join(__dirname, '/demo')));

app.listen(3000, function () {

  console.log('Example app listening on port 3000!');
});
