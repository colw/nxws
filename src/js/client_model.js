var socket = io();

var newsItems = new ObservableThing([]);
function getStateFromNewsItems() {
  return newsItems.get();
}

var numberOfReaders = new ObservableThing(Number(0));
function getStateFromNumberOfReaders() {
  return numberOfReaders.get();
}

var sourceList = new ObservableThing([]);
function getStateFromSourceList() {
  return sourceList.get();
}

socket.on('nxws items', function(msg) {
	var newItem = JSON.parse(msg);
  newItem.date = new Date(newItem.date);
  if (newItem.constructor == Object) newItem = [newItem];
  newItem[0].fetchDate = new Date();  
  var currentNews = newsItems.get();
  var totalNews = newItem.concat(currentNews);
  newsItems.set(totalNews);
});

socket.on('nxws readers', function(msg) {
  numberOfReaders.set(Number(msg));
});

socket.on('nxws sources', function(jsonSources) {
  var sources = JSON.parse(jsonSources);
  sourceList.set(sources);
});
