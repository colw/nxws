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
        React.createElement("div", {className: "subTitle"}, " – ", hosturl, ", ", this.state.formattedTimeSince)
			)
		);
	}
});

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
	render: function() {
    var randElt = this.getRandomInteger(0, this.state.cowords.length);
    var saying = this.state.cowords[randElt];
		return (
      React.createElement("div", {id: "cow"}, 
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

var NewsList = React.createClass({displayName: "NewsList", 
	render: function() {
    if (this.props.newsItems.length == 0) {
      return (
        React.createElement("div", {id: "emptyList"}, 
          React.createElement("p", null, "Please wait for some news to be published. Shanʼt be long."), 
          React.createElement("p", {id: "nogoodnews"}, "No news is good moos, right?")
        )
      )
    } else {
      var makeList = function(x) {
        return React.createElement("li", {key: x.guid}, React.createElement(NewsItem, {info: x}))
      }
      return (
  			React.createElement("ul", null, 
           this.props.newsItems.map(makeList) 
  			)
  		);
    }
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
      return React.createElement("li", {key: x, className: className}, React.createElement("button", {type: "button", value: x, onClick: that.handleClick}, text))
    }
    return (
      React.createElement("ul", {id: "tagList"},  this.props.filterTags.map(makeList) )
    );
	}
});

var NewsSources = React.createClass({displayName: "NewsSources",
  mixins: [FormatURLMixin],
  getInitialState: function() {
    return {showSources: false}
  },
  handleClick: function() {
    this.setState({ showSources: !this.state.showSources });
  },
	render: function() {
    var that = this;
    var makeList = function(x) {
      return React.createElement("li", {key: x, className: "sourceItem"}, x)
    }
    var elt = null;
    if (this.state.showSources) {
      elt = React.createElement("ul", null,  this.props.sourceList.map(makeList) )
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
    console.log('source change', s);
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
    if (filterText[0] !== '-') {    
      var newTags = this.state.filterTags.concat(filterText.toLowerCase());
      this.setState({filterText: '', filterTags: newTags});
      return;
    } else {
      var newTags = this.state.filterTags.concat(filterText.toLowerCase());
      var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, newTags);
      this.setState({filterText: '', filterTags: newTags, filteredNewsItems: newFilteredNewsList});
      return;
    }
  },
  handleTagClick: function(tagName) {
    var tags = this.state.filterTags.filter(function(x) {return x != tagName});
    
    if (this.state.filterText.length > 0)
      tags = tags.concat(this.state.filterText);
    
    var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, tags);
    this.setState({filterTags: tags, filteredNewsItems: newFilteredNewsList});
  }, 
  filterListWithTags: function(list, tags) {
    console.log("begin...", list, tags);
    if (list.length === 0) {
      return [];
    } else if (tags.length == 0) { 
      return list;      
    } else if (tags[0] === '-') { /* move empty string check elsewhere */
      return this.filterListWithTags(list, tags.slice(1));
    } else { 
      var filterContains = function(curTag, x) {
        return function(x) {
          return x.title.toLowerCase().indexOf(curTag) !== -1
              || x.metatitle.toLowerCase().indexOf(curTag) !== -1
              || x.metalink.toLowerCase().indexOf(curTag) !== -1
        }
      }
  
      var filterContainsNot = function(curTag, x) {
        return function(x) {
          return x.title.toLowerCase().indexOf(curTag) == -1
              && x.metatitle.toLowerCase().indexOf(curTag) == -1
              && x.metalink.toLowerCase().indexOf(curTag) == -1
        }
      }

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
	render: function() {
    return (
      React.createElement("div", {id: "MainContent"}, 
        React.createElement("div", {id: "headerInfo"}, 
          React.createElement(NewsInfo, {itemcount: this.state.filteredNewsItems.length, 
                    minutes: this.state.minutes, 
                    others: this.state.numberOfReaders, 
                    sources: this.state.sourceList}), 
          React.createElement(NewsCow, null), 
          React.createElement(NewsSearchBar, {onUserInput:  this.handleUserInput, filterText: this.state.filterText, onFilterSubmit: this.handleSubmit}), 
          React.createElement(NewsTagList, {filterTags:  this.state.filterTags, onTagClick: this.handleTagClick})
        ), 
        React.createElement("div", {id: "mainList"}, 
          React.createElement(NewsList, {newsItems: this.state.filteredNewsItems, filterText: this.state.filterText.toLowerCase(), filterTags: this.state.filterTags})
        )
      )
		);
	}
});

React.render(React.createElement(NewsApp, null), document.getElementById('ReactMountPoint'));
