// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var port = process.env.PORT || 3000;
var scraperjs = require('scraperjs');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom
//my own stuff


app.get('/searching', function(req, res){
      var namez = [];
      var positionz = [];
        scraperjs.StaticScraper.create('http://www.spotrac.com/nfl/seattle-seahawks/cash/')
            .scrape(function($) {
                return $("#teamTable tbody .player a").map(function() {
                    return $(this).text();
                }).get();
            }, function(names) {
              //console.log("whaddup")
              namez = names;
            })
            .scrape(function($) {
                return $("#teamTable tbody .player").map(function() {
                    return $(this).next('td').children("span").text();
                }).get();
            }, function(position) {
              //console.log("whaddup")
              positionz = position;
            })
            .scrape(function($) {
                return $(" .figure").map(function() {
                    return $(this).text();
                }).get();
            }, function(news) {
              //console.log(news)
              //console.log("whaddup")
              var theJSON = '{ "Players" : [';
              for (var i = 0; i < namez.length-1; i++) {
              namez[i] = namez[i].replace(/'/gi,"");
              theJSON = theJSON + '{"name": "' + namez[i] + '" ,"salary" : "' + news[i+1] + '" , "position": "'+ positionz[i]+'"} ,'
              }
              theJSON = theJSON + '{"name": "' + namez[namez.length] + '","salary" : "' + news[namez.length] + '" , "position": "'+ positionz[namez.length]+'"}]}'
              var asJSON = JSON.stringify(theJSON);
              res.send(asJSON)
            })
  });

