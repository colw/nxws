var FeedParser = require('feedparser');

var RSSFetch = function() {};

function fetchFeed(x) {
  that = this;
  // console.log("Fetching", x);
	this.stream(x)
	.on('error', function(err) {
    that.callback(err);
	})
	.pipe(new FeedParser())
  .on('meta', function() {
    // console.log('meta', {date: this.meta.pubdate, title: this.meta.title});
  })
  .on('readable', function() {
		var item;
		while (item = this.read()) {
      that.callback(null, item);
		}
	})
  .on('end', function() {
    // console.log('Completed', x);
    that.callback(null, {end: this.meta.title});
  })
  .on('error', function(err) {
    that.callback(err);
  });
}

RSSFetch.prototype.fetchSourceFromStream = function(src, stream, callback) {
  this.callback = callback;
  this.stream = stream;
  src.forEach(fetchFeed, this);
}

module.exports = RSSFetch;

