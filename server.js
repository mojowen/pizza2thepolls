var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var readSheet = require(__dirname +'/lib/sheet')
var charge = require(__dirname +'/lib/charge')

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

app.get("/totals", function (request, response) {
  readSheet('Totals!A:B', (err, resp) => { response.send(resp.values) })
});

app.post("/donate", function (request, response) {
  charge(request.body, (err) => { response.sendStatus(err ? 400 : 200); })
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
