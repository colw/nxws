var FeedParser = require('feedparser');

var RSSFetch = function() {};

function fetchFeed(x) {
  that = this;
  // console.log("Fetching", x);
	this.stream(x)
	.on('error', function(err) {
    that.callback(err);
	})
	.pipe(new FeedParser()).on('readable', function() {
		var item;
		while (item = this.read()) {
      that.callback(null, item);
		}
	}).on('end', function() {
    // console.log('Completed', x);
  }).on('error', function(err) {
    console.error(err);
  });
}

RSSFetch.prototype.fetchSourceFromStream = function(src, stream, callback) {
  this.callback = callback;
  this.stream = stream;
  src.forEach(fetchFeed, this);
}

module.exports = RSSFetch;

