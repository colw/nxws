var NewsItem = React.createClass({
  mixins: [FormatURLMixin],  
  getInitialState: function() {
    return { insertionTime: new Date() };
  },
	render: function() {
    var hosturl = this.getBaseURL(this.props.info.metalink);
    var fmtDate = moment(this.state.insertionTime).fromNow();
		return (
			<div className="newsItem">
				<a href={this.props.info.link} target="_blank">
					<h2>
            {this.props.info.title}
					</h2>
        </a>
        <span className="newsItemInfo"> {hosturl} – {fmtDate}</span>
			</div>
		);
	}
});

var NewsCow = React.createClass({
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
      <div id="cow">
        <img src={this.state.cow} alt="A black and white cow" title={saying} />
      </div>
		);
	}
});

var NewsReaderCount = React.createClass({
	render: function() {
    var numReaders = this.props.readerCount;
		return (
      <div id="readerCount">
        { 'With ' + numReaders + (numReaders == 1 ? ' Other' : ' Others') } 
      </div>
		);
	}
});

var NewsTimeSpent = React.createClass({
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
      <div id="timeSpent">
        { 'In ' + duration + (duration == 1 ? ' Minute' : ' Minutes') } 
      </div>
		);
	}
});

var NewsItemCount = React.createClass({
	render: function() {
    var itemCount = this.props.itemCount;
    var updateText = '';
    switch (itemCount) {
      case 0: updateText = 'No News'; break;
      case 1: updateText = '1 Update'; break;
      default: updateText = itemCount + ' Updates'; break;
    }
		return (
      <div id="itemCount">
        { updateText }
      </div>
		);
	}
});

var NewsList = React.createClass({ 
	render: function() {
    if (this.props.newsItems.length == 0) {
      return (
        <div id="emptyList">
          <p>Just wait a little while for some news to come in.</p>
          <p id="nogoodnews">No news is good news, right?</p>
        </div>
      )
    } else {
      var makeList = function(x) {
        return <li key={x.guid}><NewsItem info={x} /></li>
      }
      return (
  			<ul>
          { this.props.newsItems.map(makeList) }
  			</ul>
  		);
    }
	}
});

var NewsSearchBar = React.createClass({
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
      <div>
        <form onSubmit={this.handleSubmit}>
  	      <input id="filterTextInput"
      			ref="filterTextInput"
      			value={this.props.filterText}
      			type="search"
            onChange={this.handleChange}
      			placeholder="Filter By..."/>
        </form>
      </div>
		);
	}
});

var NewsTagList = React.createClass({
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
      return <li key={x} className={className}><button type="button" value={x} onClick={that.handleClick}>{text}</button></li>
    }
    return (
      <ul id="tagList">{ this.props.filterTags.map(makeList) }</ul>
    );
	}
});

var NewsSources = React.createClass({
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
      return <li key={x} className="sourceItem">{that.getBaseURL(x)}</li>
    }
    var elt = null;
    if (this.state.showSources) {
      elt = <ul>{ this.props.sourceList.map(makeList) }</ul>
    }
    return (
      <div id="sourceList" onClick={this.handleClick}>
        <p>From {this.props.sourceList.length} Sources</p>
        {elt}
      </div>
    );
	}
});

var NewsApp = React.createClass({
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
    this.setState({sourceList: getStateFromSourceList()});
  },
	handleUserInput: function (filterText) {
    if (filterText === '-') {
      this.setState({filterText: filterText});
      return;
    }
    var tags = this.state.filterTags;
    if (filterText.length > 0) {
      tags = tags.concat(filterText);
    }
    var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, tags);
    
		this.setState({filterText: filterText, filteredNewsItems: newFilteredNewsList});
	},
  handleSubmit: function(filterText) {
    var newTags = this.state.filterTags.concat(filterText.toLowerCase());
		this.setState({filterText: '', filterTags: newTags});
  },
  handleTagClick: function(tagName) {
    var tags = this.state.filterTags.filter(function(x) {return x != tagName});
    
    if (this.state.filterText.length > 0)
      tags = tags.concat(this.state.filterText);
    
    var newFilteredNewsList = this.filterListWithTags(this.state.newsItems, tags);
    this.setState({filterTags: tags, filteredNewsItems: newFilteredNewsList});
  }, 
  filterListWithTags: function(list, tags) {
    if (list.length === 0) {
      return [];
    } else if (tags.length == 0) { /* move empty string check elsewhere */
      return list;      
    } else if (tags[0] === '-') {
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
      <div id="MainContent">
        <div id="headerInfo">
          <NewsItemCount itemCount={ this.state.filteredNewsItems.length }/>
          <NewsTimeSpent timeSpent={ this.state.startTime }/>
          <NewsReaderCount readerCount={this.state.numberOfReaders}/>
          <NewsSources sourceList={this.state.sourceList} />
          <NewsCow />
          <NewsSearchBar onUserInput={ this.handleUserInput } filterText={this.state.filterText} onFilterSubmit={this.handleSubmit}/>      
          <NewsTagList filterTags={ this.state.filterTags} onTagClick={this.handleTagClick}/>
        </div>
        <div id="mainList">
          <NewsList newsItems={this.state.filteredNewsItems} filterText={this.state.filterText.toLowerCase()} filterTags={this.state.filterTags}/>
        </div>
      </div>
		);
	}
});

React.render(<NewsApp />, document.getElementById('ReactMountPoint'));
