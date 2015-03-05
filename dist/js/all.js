var ObservableThing = function(thing) {
  this.thing = thing;
  this.onChangeListener = null;
};

ObservableThing.prototype.set = function(newValue) {
  this.thing = newValue;
  this.notify();
};

ObservableThing.prototype.get = function() {
  return this.thing;
};

ObservableThing.prototype.setChangeListener = function(listener) {
  this.onChangeListener = listener;
};

ObservableThing.prototype.notify = function() {
  if (this.onChangeListener !== null) {
    this.onChangeListener();
  }
};

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
};

var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var NewsCow = React.createClass({displayName: "NewsCow",
  mixins: [RandomHelpMixin],
  getInitialState: function() {
    var cowords = [
        "Udderly brilliant"
      , "News that mooves you"
      , "Hoofin' along"      
    ];
    return {cow: './images/Guernsey_cow.png', cowords: cowords};
  },
  handleClick: function() {
    this.props.onClickHandler();
  },
	render: function() {
    var randElt = this.getRandomInteger(0, this.state.cowords.length);
    var saying = this.state.cowords[randElt];
		return (
      React.createElement("div", {id: "cow", onClick: this.props.onClickHandler}, 
        React.createElement("img", {src: this.state.cow, alt: "A black and white cow", title: saying})
      )
		);
	}
});

var NewsReaderCount = React.createClass({displayName: "NewsReaderCount",
	render: function() {
    var text = '';
    switch (this.props.readerCount) {
      case 0: text = 'With No Others'; break;
      case 1: text = 'With 1 Other'; break;
      default: text = 'With ' + this.props.readerCount + ' Others'; break;
    }    
		return (
      React.createElement("span", {id: "readerCount"}, 
         text 
      )
		);
	}
});

var NewsItemCount = React.createClass({displayName: "NewsItemCount",
	render: function() {
    var itemCount = this.props.itemcount;
    var updateText = '';
    switch (itemCount) {
      case 0: updateText = 'No News'; break;
      case 1: updateText = '1 Update'; break;
      default: updateText = itemCount + ' Updates'; break;
    }
		return (
      React.createElement("span", {id: "itemCount"}, updateText)
		);
	}
});

var NewsSearchBar = React.createClass({displayName: "NewsSearchBar",
  getInitialState: function() {
    return {filterText: ''};
  },
  handleChange: function() {
		this.props.onUserInput(
			this.refs.filterTextInput.getDOMNode().value
		);
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var filterText = this.refs.filterTextInput.getDOMNode().value;
    this.props.onFilterSubmit(filterText);
  },
	render: function() {
    return (
      React.createElement("div", {id: "filterBox"}, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
  	      React.createElement("input", {id: "filterTextInput", 
      			ref: "filterTextInput", 
      			value: this.props.filterText, 
      			type: "search", 
            onChange: this.handleChange, 
      			placeholder: "Filter By..."})
        )
      )
		);
	}
});

var NewsTagList = React.createClass({displayName: "NewsTagList",
  handleClick: function(e) {
      this.props.onTagClick(e.currentTarget.getAttribute('value'));
  },
	render: function() {
    var that = this;
    var makeList = function(x) {
      var className="tagItem tagInclude";
      var text = x;
      if (x[0] === '-') {
        text = x.slice(1);
        className="tagItem tagExclude";
      }
      return (
        React.createElement("li", {key: x, className: className}, 
          React.createElement("button", {type: "button", value: x, onClick: that.handleClick}, text)
        )
      );
    };
    return (
      React.createElement("ul", {id: "tagList"},  this.props.filterTags.map(makeList) )
    );
	}
});

var NewsSources = React.createClass({displayName: "NewsSources",
  mixins: [FormatURLMixin],
  getInitialState: function() {
    return {showSources: false};
  },
  handleClick: function() {
    this.setState({ showSources: !this.state.showSources });
  },
	render: function() {
    var that = this;
    var makeList = function(x) {
      return (React.createElement("li", {key: x, className: "sourceItem"}, x));
    };
    var elt = null;
    if (this.state.showSources) {
      elt = (React.createElement("ul", null,  this.props.sourceList.map(makeList) ));
    }
    return (
      React.createElement("span", {id: "sourceList", onClick: this.handleClick}, 
        'from ' + this.props.sourceList.length + ' Sources', 
        elt
      )
    );
	}
});

var NewsDuration = React.createClass({displayName: "NewsDuration",
	render: function() {
    var duration = this.props.duration;
    var text = 'in ' + duration + (duration == 1 ? ' Minute' : ' Minutes');
    return (
      React.createElement("span", null, text)
    );
  }
});

var NewsInfo = React.createClass({displayName: "NewsInfo",
	render: function() {
    return (
      React.createElement("div", {id: "newheader"}, 
          React.createElement(NewsItemCount, {itemcount: this.props.itemcount}), " ", React.createElement(NewsDuration, {duration: this.props.minutes}), " ", React.createElement(NewsSources, {sourceList: this.props.sources})
      )
    );
  }
});



var HowCow = React.createClass({displayName: "HowCow",
	render: function() {
		return (
			React.createElement("div", {id: "aboutCow"}, 

        React.createElement("h2", {id: "cowwhat"}, "What?"), 
          
        React.createElement("p", null, "This is a world news feed. Give it a minute or two for items to be published."), 
                    
        React.createElement("p", null, "It's very easy to search or filter by typing in the box. Instant actually. If you want to keep it," + ' ' +
        "just hit enter and the term will be added to a tag list. You can stack filter tags on top of each other."), 
          
        React.createElement("ul", {className: "tutTags"}, 
          React.createElement("li", {className: "tagItem tagInclude"}, React.createElement("button", {type: "button"}, "Highland Cows")), 
          React.createElement("li", {className: "tagItem tagInclude"}, React.createElement("button", {type: "button"}, "Mountain Goats"))
        ), 

        React.createElement("p", null, "As an extra, place a dash (-) at the beginning of the term and you can choose what not to see."), 
          
        React.createElement("ul", {className: "tutTags"}, 
          React.createElement("li", {className: "tagItem tagExclude"}, React.createElement("button", {type: "button"}, "Beef"))
        ), 

        React.createElement("p", null, "Tags are colour coded, so you will know how the list is being filtered. If you want to remove it, just click" + ' ' +
        "it. It's like they were never there. Magic."), 
              
        React.createElement("p", null, "Click the word 'Sources' (just above the cow) if you wish to see where the news comes from."), 

        React.createElement("p", null, "Take your time, the news will keep coming even as you read this."), 
      
        React.createElement("h2", {id: "cowwhy"}, "Why?"), 
      
        React.createElement("p", null, "I like reading news, and I like programming. You could also say I like to reinvent the wheel, but" + ' ' +
        "take a closer look and you may agree this feed is a little different."), 
      
        React.createElement("p", null, "You cannot set the source of the news, but you can curate with broad, simple strokes, by using tagging." + ' ' +
        "Searching is fast too."), 

        React.createElement("p", null, "This site is intended for slow movers and not those who find themselves in a hurry. It intentionally" + ' ' +
        "shows nothing when you load it, and from then it will only show news as it is published. It's about the" + ' ' +
        "present, at a speed you can work with."), 

        React.createElement("h2", {id: "cowhow"}, "How?"), 
      
        React.createElement("p", null, "Technically speaking, there is a ", React.createElement("a", {href: "http://www.nodejs.org", target: "_blank"}, "Node.js"), " back end" + ' ' +
        "on the look out for news. When it finds some, it will send it straight to your browser using ", React.createElement("a", {
        href: "http://socket.io", target: "_blank"}, "Socket.io"), ". The whole rendering experience is based upon ", React.createElement("a", {
        href: "http://facebook.github.io/react", target: "_blank"}, "React"), ". "), 
      
        React.createElement("p", null, React.createElement("a", {href: "http://gulpjs.com", target: "_blank"}, "Gulp"), " is a big help too, but that's about enough" + ' ' +
        "tech. Read the ", React.createElement("a", {href: "http://github.com/colw/nxws", target: "_blank"}, "code"), " if you're curious."), 
        
        React.createElement("h2", {id: "cowwho"}, "Who?"), 
        
        React.createElement("p", {id: "smallwho"}, "I can be reached ", React.createElement("a", {href: "mailto:colw@outlook.com"}, "here"), ".")

      )
		);
	}
});
var NewsItem = React.createClass({displayName: "NewsItem",
  mixins: [FormatURLMixin, SetIntervalMixin],
  getInitialState: function() {
    return {formattedTimeSince: moment(this.props.info.fetchDate).fromNow()};
  },
  componentDidMount: function() {
    this.setInterval(this.updateTime, 30000);
  },
  updateTime: function() {
    this.setState({formattedTimeSince: moment(this.props.info.fetchDate).fromNow()});
  },
	render: function() {
    var hosturl = this.getBaseURL(this.props.info.metalink);
		return (
			React.createElement("div", {className: "newsItem"}, 
				React.createElement("a", {href: this.props.info.link, target: "_blank"}, 
					React.createElement("div", {className: "headTitle"}, 
            this.props.info.title
					)
        ), 
        React.createElement("div", {className: "subTitle"}, hosturl, ", ", React.createElement("span", {className: "subTime"}, this.state.formattedTimeSince))
			)
		);
	}
});

var NewsList = React.createClass({displayName: "NewsList", 
	render: function() {
    if (this.props.newsItems.length === 0) {
      return (
        React.createElement("div", {id: "emptyList"}, 
          React.createElement("p", null, "Please wait for some news to be published. Shan't be long."), 
          React.createElement("p", {id: "nogoodnews"}, "No news is good moos, right?")
        )
      );
    } else {
      var makeList = function(x) {
        return (React.createElement("li", {key: x.guid}, React.createElement(NewsItem, {info: x})));
      };
      return (
  			React.createElement("ul", null, 
           this.props.newsItems.map(makeList) 
  			)
  		);
    }
	}
});

var NewsApp = React.createClass({displayName: "NewsApp",
  mixins: [SetIntervalMixin],
  getInitialState: function() {
    return {
        filterText: ''
      , filterTags: []
      , newsItems: getStateFromNewsItems()
      , filteredNewsItems: []
      , numberOfReaders: getStateFromNumberOfReaders()
      , sourceList: getStateFromSourceList()
      , minutes: 0
      , showAbout: false
    };
  },
  tick: function() {
    this.setState({minutes: this.state.minutes + 1});
  },
  componentDidMount: function() {
    newsItems.setChangeListener(this.onStorageChange);
    numberOfReaders.setChangeListener(this.onReaderChange);
    sourceList.setChangeListener(this.onSourceListChange);
    this.setInterval(this.tick, 60000);
    this.setState({filteredNewsItems: this.state.newsItems.slice()});
  },
  onStorageChange: function() {
    var newNewsList = getStateFromNewsItems();
    var tags = this.state.filterTags;
    if (this.state.filterText.length > 0) {
      tags = tags.concat(this.state.filterText);
    }
    var newFilteredNewsList = this.filterListWithTags(newNewsList, tags);
    this.setState({newsItems: newNewsList, filteredNewsItems: newFilteredNewsList}); //woop
  },
  onReaderChange: function() {
    this.setState({numberOfReaders: getStateFromNumberOfReaders()});
  },
  onSourceListChange: function() {
    var s = getStateFromSourceList();
    this.setState({sourceList: s});
  },
	handleUserInput: function (filterText) {
    
    var modFilterText = filterText.toLowerCase();
    
    if (modFilterText[0] === '-') {
      this.setState({filterText: filterText});
      return;
    }
    var tags = this.state.filterTags;
    if (modFilterText.length > 0) {
      tags = tags.concat(modFilterText);
    }
    var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, tags);
    
		this.setState({filterText: filterText, filteredNewsItems: newFilteredNewsList});
	},
  handleSubmit: function(filterText) {
    var newTags;  
    if (filterText[0] !== '-') {    
      newTags = this.state.filterTags.concat(filterText.toLowerCase());
      this.setState({filterText: '', filterTags: newTags});
      return;
    } else {
      newTags = this.state.filterTags.concat(filterText.toLowerCase());
      var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, newTags);
      this.setState({filterText: '', filterTags: newTags, filteredNewsItems: newFilteredNewsList});
      return;
    }
  },
  handleTagClick: function(tagName) {
    var tags = this.state.filterTags.filter(function(x) {return x != tagName;});
    
    if (this.state.filterText.length > 0)
      tags = tags.concat(this.state.filterText);
    
    var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, tags);
    this.setState({filterTags: tags, filteredNewsItems: newFilteredNewsList});
  }, 
  filterListWithTags: function(list, tags) {
    if (list.length === 0) {
      return [];
    } else if (tags.length === 0) { 
      return list;      
    } else if (tags[0] === '-') { /* move empty string check elsewhere */
      return this.filterListWithTags(list, tags.slice(1));
    } else { 
      
      var searchText = function(x) {
        return  ((x.title?x.title:'') 
                + (x.metatitle?x.metatitle:'')
                + (x.metalink?x.metalink:'')).toLowerCase();
      }
      
      var filterContains = function(curTag, x) {
        return function(x) {
          var xt = searchText(x);
          return xt.indexOf(curTag) !== -1
        };
      };
  
      var filterContainsNot = function(curTag, x) {
        return function(x) {
          var xt = searchText(x);
          return xt.indexOf(curTag) === -1
        };
      };

      var curTag = tags[0];
      var filteredList;      
      if (curTag[0] === '-') {
        curTag = curTag.slice(1);
        filteredList = list.filter(filterContainsNot(curTag));
      } else {
        filteredList = list.filter(filterContains(curTag));
      }
            
      return this.filterListWithTags(filteredList, tags.slice(1));
    }
  },
  onCowClick: function(e) {
    console.log('click');
    this.setState({showAbout: !this.state.showAbout});
  },
	render: function() {
    var main = this.state.showAbout ? React.createElement(HowCow, null) : (React.createElement(NewsList, {newsItems: this.state.filteredNewsItems, filterText: this.state.filterText.toLowerCase(), filterTags: this.state.filterTags}));
    return (
      React.createElement("div", {id: "MainContent"}, 
        React.createElement("div", {id: "headerInfo"}, 
          React.createElement(NewsInfo, {itemcount: this.state.filteredNewsItems.length, 
                    minutes: this.state.minutes, 
                    others: this.state.numberOfReaders, 
                    sources: this.state.sourceList}), 
          React.createElement(NewsCow, {onClickHandler: this.onCowClick}), 
          React.createElement(NewsSearchBar, {onUserInput:  this.handleUserInput, filterText: this.state.filterText, onFilterSubmit: this.handleSubmit}), 
          React.createElement(NewsTagList, {filterTags:  this.state.filterTags, onTagClick: this.handleTagClick})
        ), 
        React.createElement("div", {id: "mainList"}, 
                    main
        )
      )
		);
	}
});

React.render(React.createElement(NewsApp, null), document.getElementById('ReactMountPoint'));
