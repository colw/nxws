var request = require('request');
var fetchfeed = require('./fetchfeed.js');
var nxws = new fetchfeed();
var feeds = require('./feeds.json').remote;
var checkNewsInterval;

var db = require('monk')('localhost/newsdb');
var db_items = db.get('items');

function fetchFeeds() {
  // console.log('Fetching', feeds.length, 'feeds');
  nxws.fetchSourceFromStream(feeds, request, storeContentsOfFeed);
}

fetchFeeds();
setInterval(function() {
  fetchFeeds();
}, 10000);

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
  }
  if (newItem.date > new Date()) newItem.date = new Date();  
  
  db_items.findOne({guid: newItem.guid}, function(e, d){
    if (err) throw err;
    if (null == d) {
      console.log("(" + new Date() + ") inserting and sending: ", newItem.title);
      db_items.insert(newItem, function(err, d) {
        if (err) throw err;
        io.emit('nxws items', JSON.stringify([d]));
      });
      
    }
  });
}

/* Server */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
	console.log('listening on *:3000');
});

/* Socket */
io.on('connection', function(socket) {
	console.log("User connected", socket.id);
  emitNumberOfUsers(io.sockets.sockets.length);
  socket.beginTime = new Date();
  
  // sendNews(socket);
  
  socket.on('disconnect', function() {
  	console.log("User disconnected", socket.id);
    emitNumberOfUsers(io.sockets.sockets.length);
  });    
});

/* Broadcasting */
function sendNews(socket) {
  db_items.find({}, {sort: {date: -1}})
          .on('success', createNewsEmitterForSocket(socket));
}

function emitNumberOfUsers(num) {
  console.log('User count', io.sockets.sockets.length)
  io.emit('nxws readers', num);
}

function createNewsEmitterForSocket(socket) {
  return function (docs) {
    console.log('Sending ' + docs.length + ' items to ' + socket.id);
    socket.emit('nxws items', JSON.stringify(docs));
  }
}
