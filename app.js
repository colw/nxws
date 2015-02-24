var request = require('request');
var fetchfeed = require('./fetchfeed.js');
var nxws = new fetchfeed();
var feeds = require('./feeds.json').remote;
var checkNewsInterval;

var db = require('monk')('localhost/newsdb');
var db_items = db.get('rss_guids');

var REFRESH_DELAY = 30000;

function fetchFeeds() {
  // console.log('Fetching', feeds.length, 'feeds');
  nxws.fetchSourceFromStream(feeds, request, storeContentsOfFeed);
}

fetchFeeds();
setInterval(function() {
  fetchFeeds();
}, REFRESH_DELAY);

/* Storage */
function storeContentsOfFeed(err, x) {  
  if (err) {
    console.error(err);
    return;
  }
  
  var newItem = {
    title: x.title,
    author: x.author,
    date: new Date(x.date),
    guid: x.guid,
    link: x.link,
    metatitle: x.meta.title,
    metalink: x.meta.link
  };
  if (newItem.date > new Date()) newItem.date = new Date();  
  
  db_items.findOne({guid: newItem.guid}, function(e, d){
    if (err) throw err;
    if (null === d) {
      console.log("(" + new Date() + ") inserting and sending: ", newItem.title);
      db_items.insert({guid: newItem.guid}, function(err, d) {
        if (err) throw err;
        io.emit('nxws items', JSON.stringify([newItem]));
      });
      
    }
  });
}

/* Server */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

/* Socket */
io.on('connection', function(socket) {
	console.log("User connected", socket.id);
  emitNumberOfUsers(io.sockets.sockets.length);
  socket.beginTime = new Date();
  
  socket.on('request news', function() {
    sendAllNews(socket);
  });
  
  socket.on('disconnect', function() {
  	console.log("User disconnected", socket.id);
    emitNumberOfUsers(io.sockets.sockets.length);
  });    
});

/* Broadcasting */
function sendAllNews(socket) {
  db_items.find({}, {sort: {date: -1}})
          .on('success', createNewsEmitterForSocket(socket));
}

function emitNumberOfUsers(num) {
  console.log('User count', io.sockets.sockets.length);
  io.emit('nxws readers', num);
}

function createNewsEmitterForSocket(socket) {
  return function (docs) {
    console.log('Sending ' + docs.length + ' items to ' + socket.id);
    socket.emit('nxws items', JSON.stringify(docs));
  };
}
