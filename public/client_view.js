var NewsItem = React.createClass({displayName: "NewsItem",
  getInitialState: function() {
    return { insertionTime: new Date() }
  },  
  getBaseURL: function(url) {
    if (url.slice(0,4) != 'http') {
      url = 'http://' + url;
    }
    var a = document.createElement('a');
    a.href = url;
    if (a.hostname == 'http')
      console.log(url, a.hostname)
    return a.hostname.replace(/^www./, '');
  },
	render: function() {
    var hosturl = this.getBaseURL(this.props.info.metalink);
    var fmtDate = moment(this.state.insertionTime).fromNow()
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
    var numReaders = this.props.readerCount - 1;
		return (
      React.createElement("div", {id: "readerCount"}, 
        "with ",  numReaders + (numReaders == 1 ? ' Other' : ' Others') 
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
        "in ",  duration + (duration == 1 ? ' Minute' : ' Minutes') 
      )
		);
	}
});

var NewsItemCount = React.createClass({displayName: "NewsItemCount",
	render: function() {
    var itemCount = this.props.itemCount;
    var updateText = '';
    console.log('itemCount', itemCount);
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
  filterThroughTags: function(list, listOfTags) {
    var tmp = list;
    for(var i = 0; i < listOfTags.length; ++i) {
      tmp = tmp.filter(function(x) {
        return x.title.toLowerCase().indexOf(listOfTags[i]) != -1
            || x.metatitle.toLowerCase().indexOf(listOfTags[i]) != -1;
      });    
    }
    return tmp;
  },  
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
      var filterForText = function(x) {
        return x.title.toLowerCase().indexOf(this.props.filterText) != -1
            || x.metalink.toLowerCase().indexOf(this.props.filterText) != -1;
      }
      var filterList = this.props.filterTags.concat(this.props.filterText);
      return (
  			React.createElement("ul", null, 
           this.filterThroughTags(this.props.newsItems, filterList).map(makeList) 
  				/*this.props.newsItems.filter(filterForText, this).map(makeList) */
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
  	      React.createElement("input", {	className: "form-control", 
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
  handleClick2: function(e) {
    console.log('button', e.currentTarget.getAttribute('value'));
    e.preventDefault();
    this.props.onTagClick('egypt');
  },
	render: function() {
    var that = this;
    var makeList = function(x) {
      return React.createElement("li", {key: x}, React.createElement("button", {type: "button", value: x, onClick: that.handleClick}, x))
    }    
    return (
      React.createElement("ul", {id: "tagList"},  this.props.filterTags.map(makeList) )
    );
	}
});

var NewsApp = React.createClass({displayName: "NewsApp",
  getInitialState: function() {
    return {
            startTime: new Date(), filterText: '', filterTags: []
          , newsItems: getStateFromNewsItems()
          , numberOfReaders: getStateFromNumberOfReaders()
    };
  },
  componentDidMount: function() {
    newsItems.setChangeListener(this.onStorageChange);
    numberOfReaders.setChangeListener(this.onReaderChange);
  },
  onStorageChange: function() {
    this.setState({newsItems: getStateFromNewsItems()});
  },
  onReaderChange: function() {
    this.setState({numberOfReaders: getStateFromNumberOfReaders()});
  },
	handleUserInput: function (filterText) {
		this.setState({filterText: filterText});
	},
  handleSubmit: function(filterText) {
    var newTags = this.state.filterTags.concat(filterText.toLowerCase());
		this.setState({filterText: '', filterTags: newTags});
  },
  handleTagClick: function(tagName) {
    var newTags = this.state.filterTags.filter(function(x) {return x != tagName});
    console.log('filterTags New', tagName, newTags);
		this.setState({filterTags: newTags});
  },
	render: function() {
    return (
      React.createElement("div", {id: "MainContent"}, 
        React.createElement("div", {id: "headerInfo"}, 
          React.createElement(NewsItemCount, {itemCount:  this.state.newsItems.length}), 
          React.createElement(NewsTimeSpent, {timeSpent:  this.state.startTime}), 
          React.createElement(NewsReaderCount, {readerCount: this.state.numberOfReaders}), 
          React.createElement(NewsSearchBar, {onUserInput:  this.handleUserInput, filterText: this.state.filterText, onFilterSubmit: this.handleSubmit}), 
          React.createElement(NewsTagList, {filterTags:  this.state.filterTags, onTagClick: this.handleTagClick})
        ), 
        React.createElement("div", {id: "mainList"}, 
            React.createElement(NewsList, {newsItems: this.state.newsItems, filterText: this.state.filterText.toLowerCase(), filterTags: this.state.filterTags})
        )
      )
		);
	}
});

React.render(React.createElement(NewsApp, null), document.getElementById('ReactMountPoint'));
