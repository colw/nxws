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
      return <li key={x} className="tagItem"><button type="button" value={x} onClick={that.handleClick}>{x}</button></li>
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
