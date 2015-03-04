var NewsItem = React.createClass({
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
			<div className="newsItem">
				<a href={this.props.info.link} target="_blank">
					<div className="headTitle">
            {this.props.info.title}
					</div>
        </a>
        <div className="subTitle">{hosturl}, <span className="subTime">{this.state.formattedTimeSince}</span></div>
			</div>
		);
	}
});

var NewsList = React.createClass({ 
	render: function() {
    if (this.props.newsItems.length === 0) {
      return (
        <div id="emptyList">
          <p>Please wait for some news to be published. Shan't be long.</p>
          <p id="nogoodnews">No news is good moos, right?</p>
        </div>
      );
    } else {
      var makeList = function(x) {
        return (<li key={x.guid}><NewsItem info={x} /></li>);
      };
      return (
  			<ul>
          { this.props.newsItems.map(makeList) }
  			</ul>
  		);
    }
	}
});

var NewsApp = React.createClass({
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
    console.log("begin...", list, tags);
    if (list.length === 0) {
      return [];
    } else if (tags.length === 0) { 
      return list;      
    } else if (tags[0] === '-') { /* move empty string check elsewhere */
      return this.filterListWithTags(list, tags.slice(1));
    } else { 
      var filterContains = function(curTag, x) {
        return function(x) {
          return x.title.toLowerCase().indexOf(curTag) !== -1
              || x.metatitle.toLowerCase().indexOf(curTag) !== -1
              || x.metalink.toLowerCase().indexOf(curTag) !== -1;
        };
      };
  
      var filterContainsNot = function(curTag, x) {
        return function(x) {
          return x.title.toLowerCase().indexOf(curTag) == -1
              && x.metatitle.toLowerCase().indexOf(curTag) == -1
              && x.metalink.toLowerCase().indexOf(curTag) == -1;
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
    var main = this.state.showAbout ? <HowCow /> : (<NewsList newsItems={this.state.filteredNewsItems} filterText={this.state.filterText.toLowerCase()} filterTags={this.state.filterTags}/>);
    return (
      <div id="MainContent">
        <div id="headerInfo">
          <NewsInfo itemcount={this.state.filteredNewsItems.length}
                    minutes={this.state.minutes}
                    others={this.state.numberOfReaders}
                    sources={this.state.sourceList} />
          <NewsCow onClickHandler={this.onCowClick}/>
          <NewsSearchBar onUserInput={ this.handleUserInput } filterText={this.state.filterText} onFilterSubmit={this.handleSubmit}/>      
          <NewsTagList filterTags={ this.state.filterTags} onTagClick={this.handleTagClick}/>
        </div>
        <div id="mainList">
                    {main}
        </div>
      </div>
		);
	}
});

React.render(<NewsApp />, document.getElementById('ReactMountPoint'));
