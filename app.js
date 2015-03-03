var request = require('request');
var fetchfeed = require('./fetchfeed.js');
var nxws = new fetchfeed();
var feedDict = require('./feeds.json').remote;
var feedNames = Object.keys(feedDict);
var feeds = Object.keys(feedDict).map(function(x) {return feedDict[x]});

var checkNewsInterval;

var REFRESH_DELAY = 15000;

function fetchFeeds(callback) {
  nxws.fetchSourceFromStream(feeds, request, callback);
}

nxws.fetchSourceFromStream(feeds, request, storeArticleDates);
checkNewsInterval = setInterval(function() {
  fetchFeeds(emitArticleIfNew);
}, REFRESH_DELAY);

var mostRecentDateFromFeed = {};
var mostRecentDateRunning = {};

function constructSmallArticle(article) {
  var newItem = {
    title: article.title,
    author: article.author,
    date: new Date(article.date),
    guid: article.guid,
    link: article.link,
    metatitle: article.meta.title,
    metalink: article.meta.link
  };
  
  if (newItem.metalink == null)
    newItem.metalink = newItem.link;
  
  if (newItem.date > new Date())
    newItem.date = new Date();

  return newItem;
}

function storeArticleDates(err, article) {
  if (err) {
    console.error(err);
    return;
  }
  
  if (article.hasOwnProperty('end')) {
    return;
  }
  
  var articleDate = article.date;
  if (mostRecentDateFromFeed[article.meta.title] == null ||
      mostRecentDateFromFeed[article.meta.title] < articleDate) {
    mostRecentDateFromFeed[article.meta.title] = articleDate;
    mostRecentDateRunning[article.meta.title] = articleDate;
  }
}

function emitArticleIfNew(err, article) {
  if (err) {
    console.error(err);
    return;
  }
  
  if (article.hasOwnProperty('end')) {
    mostRecentDateFromFeed[article.end] = mostRecentDateRunning[article.end];
    return;
  }
  
  var lastArticleSentDate = mostRecentDateFromFeed[article.meta.title];
  if (article.date > lastArticleSentDate) {
    console.log('Emitting:', article.meta.title, '-', article.title, '-', article.date);

    var newItem = constructSmallArticle(article);
    io.emit('nxws items', JSON.stringify([newItem]));

    if (newItem.date > mostRecentDateRunning[newItem.metatitle])
      mostRecentDateRunning[newItem.metatitle] = newItem.date;

  }
  
}

function emitArticle(socket) {
  return function(err, article) {
    if (err) {
      console.error(err);
      return;
    }
  
    if (article.hasOwnProperty('end')) {
      return;
    }
    var newItem = constructSmallArticle(article);
    socket.emit('nxws items', JSON.stringify([newItem]));
  } 
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

var numberOfUsers = 0;

/* Socket */
io.on('connection', function(socket) {
  numberOfUsers++;
	console.log("User connected", socket.id);
  emitNumberOfUsers(numberOfUsers);
  emitSourceList(feedNames);
  
  if (process.env.EMIT_NOW) {
    console.log('emitting now');
    fetchFeeds(emitArticle(socket));
  }
  
  socket.on('disconnect', function() {
    numberOfUsers--;
  	console.log("User disconnected", socket.id);
    emitNumberOfUsers(numberOfUsers);
  });    
});

/* Broadcasting */
function emitNumberOfUsers(num) {
  console.log('User count', num);
  var numOtherUsers = num === 0 ? 0 : num - 1;
  io.emit('nxws readers', numOtherUsers);
}

function emitSourceList(feedList) {
  io.emit('nxws sources', JSON.stringify(feedList));
}
