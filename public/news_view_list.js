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
    if (this.props.newsItems.length == 0) {
      return (
        React.createElement("div", {id: "emptyList"}, 
          React.createElement("p", null, "Please wait for some news to be published. Shan't be long."), 
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
  onCowClick: function(e) {
    console.log('click');
    this.setState({showAbout: !this.state.showAbout});
  },
	render: function() {
    var main = this.state.showAbout ? React.createElement(HowCow, null) : (React.createElement(NewsList, {newsItems: this.state.filteredNewsItems, filterText: this.state.filterText.toLowerCase(), filterTags: this.state.filterTags}))
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
