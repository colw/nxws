var NewsItem = React.createClass({displayName: "NewsItem",
  mixins: [FormatURLMixin],  
  getInitialState: function() {
    return { insertionTime: new Date() };
  },
	render: function() {
    var hosturl = this.getBaseURL(this.props.info.metalink);
    var fmtDate = moment(this.state.insertionTime).fromNow();
		return (
			React.createElement("div", {className: "newsItem"}, 
				React.createElement("a", {href: this.props.info.link, target: "_blank"}, 
					React.createElement("h2", null, 
            this.props.info.title
					)
        ), 
        React.createElement("span", {className: "newsItemInfo"}, " ", hosturl, " – ", fmtDate)
			)
		);
	}
});

var NewsReaderCount = React.createClass({displayName: "NewsReaderCount",
	render: function() {
    var numReaders = this.props.readerCount;
		return (
      React.createElement("div", {id: "readerCount"}, 
         'With ' + numReaders + (numReaders == 1 ? ' Other' : ' Others') 
      )
		);
	}
});

var NewsTimeSpent = React.createClass({displayName: "NewsTimeSpent",
  getInitialState: function() {
    return {curTime: new Date()}
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 5000);
  },
  componentDidUnMount: function() {
    clearInterval(this.interval)
  },
  tick: function() {
    this.setState({curTime: new Date()});
  },
	render: function() {
    var diff = this.state.curTime - this.props.timeSpent;
    var duration = moment.duration(diff).minutes();
		return (
      React.createElement("div", {id: "timeSpent"}, 
         'In ' + duration + (duration == 1 ? ' Minute' : ' Minutes') 
      )
		);
	}
});

var NewsItemCount = React.createClass({displayName: "NewsItemCount",
	render: function() {
    var itemCount = this.props.itemCount;
    var updateText = '';
    switch (itemCount) {
      case 0: updateText = 'No News'; break;
      case 1: updateText = '1 Update'; break;
      default: updateText = itemCount + ' Updates'; break;
    }
		return (
      React.createElement("div", {id: "itemCount"}, 
        updateText 
      )
		);
	}
});

var NewsList = React.createClass({displayName: "NewsList", 
	render: function() {
    if (this.props.newsItems.length == 0) {
      return (
        React.createElement("div", {id: "emptyList"}, 
          React.createElement("p", null, "Just wait a little while for some news to come in."), 
          React.createElement("p", {id: "nogoodnews"}, "No news is good news, right?")
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
      React.createElement("div", null, 
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
      return React.createElement("li", {key: x, className: "tagItem"}, React.createElement("button", {type: "button", value: x, onClick: that.handleClick}, x))
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
      return React.createElement("li", {key: x, className: "sourceItem"}, that.getBaseURL(x))
    }
    var elt = null;
    if (this.state.showSources) {
      elt = React.createElement("ul", null,  this.props.sourceList.map(makeList) )
    }
    return (
      React.createElement("div", {id: "sourceList", onClick: this.handleClick}, 
        React.createElement("p", null, "From ", this.props.sourceList.length, " Sources"), 
        elt
      )
    );
	}
});

var NewsApp = React.createClass({displayName: "NewsApp",
  getInitialState: function() {
    return {
        startTime: new Date()
      , filterText: ''
      , filterTags: []
      , newsItems: getStateFromNewsItems()
      , filteredNewsItems: []
      , numberOfReaders: getStateFromNumberOfReaders()
      , sourceList: getStateFromSourceList()
    };
  },
  componentDidMount: function() {
    newsItems.setChangeListener(this.onStorageChange);
    numberOfReaders.setChangeListener(this.onReaderChange);
    sourceList.setChangeListener(this.onSourceListChange);
    this.setState({filteredNewsItems: this.state.newsItems.slice()});
  },
  onStorageChange: function() {
    var newNewsList = getStateFromNewsItems();
    var newFilteredNewsList = this.filterThroughTags(newNewsList, this.state.filterTags.concat(this.state.filterText));
    this.setState({newsItems: newNewsList, filteredNewsItems: newFilteredNewsList}); //woop
  },
  onReaderChange: function() {
    this.setState({numberOfReaders: getStateFromNumberOfReaders()});
  },
  onSourceListChange: function() {
    this.setState({sourceList: getStateFromSourceList()});
  },
	handleUserInput: function (filterText) {
    var newFilteredNewsList = this.filterThroughTags(this.state.newsItems, this.state.filterTags.concat(filterText));
		this.setState({filterText: filterText, filteredNewsItems: newFilteredNewsList});
	},
  handleSubmit: function(filterText) {
    var newTags = this.state.filterTags.concat(filterText.toLowerCase());
		this.setState({filterText: '', filterTags: newTags});
  },
  handleTagClick: function(tagName) {
    var newTags = this.state.filterTags.filter(function(x) {return x != tagName});
    var newFilteredNewsList = this.filterThroughTags(this.state.newsItems, newTags);
		this.setState({filterTags: newTags, filteredNewsItems: newFilteredNewsList});
  },
  filterThroughTags: function(list, listOfTags) {
    var tmp = list;
    for(var i = 0; i < listOfTags.length; ++i) {
      tmp = tmp.filter(function(x) {
        return x.title.toLowerCase().indexOf(listOfTags[i]) != -1
            || x.metatitle.toLowerCase().indexOf(listOfTags[i]) != -1
            || x.metalink.toLowerCase().indexOf(listOfTags[i]) != -1;
      });    
    }
    return tmp;
  },
	render: function() {
    return (
      React.createElement("div", {id: "MainContent"}, 
        React.createElement("div", {id: "headerInfo"}, 
          React.createElement(NewsItemCount, {itemCount:  this.state.filteredNewsItems.length}), 
          React.createElement(NewsTimeSpent, {timeSpent:  this.state.startTime}), 
          React.createElement(NewsReaderCount, {readerCount: this.state.numberOfReaders}), 
          React.createElement(NewsSources, {sourceList: this.state.sourceList}), 
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
