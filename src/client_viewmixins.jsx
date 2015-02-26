var FormatURLMixin = {
  getBaseURL: function(url) {
    if (url.slice(0,4) != 'http') {
      url = 'http://' + url;
    }
    var a = document.createElement('a');
    a.href = url;
    return a.hostname.replace(/^www./, '');
  }
};

var RandomHelpMixin = {
  getRandomInteger: function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
