var NewsItem = React.createClass({
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

var NewsReaderCount = React.createClass({
	render: function() {
    var numReaders = this.props.readerCount - 1;
		return (
      <div id="readerCount">
        with { numReaders + (numReaders == 1 ? ' Other' : ' Others') } 
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
        in { duration + (duration == 1 ? ' Minute' : ' Minutes') } 
      </div>
		);
	}
});

var NewsItemCount = React.createClass({
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
      <div id="itemCount">
        { updateText }
      </div>
		);
	}
});

var NewsList = React.createClass({
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
        <div id="emptyList">
          <p>Just wait a little while for some news to come in.</p>
          <p id="nogoodnews">No news is good news, right?</p>
        </div>
      )
    } else {
      var makeList = function(x) {
        return <li key={x.guid}><NewsItem info={x} /></li>
      }
      var filterForText = function(x) {
        return x.title.toLowerCase().indexOf(this.props.filterText) != -1
            || x.metalink.toLowerCase().indexOf(this.props.filterText) != -1;
      }
      var filterList = this.props.filterTags.concat(this.props.filterText);
      return (
  			<ul>
          { this.filterThroughTags(this.props.newsItems, filterList).map(makeList) }
  				{ /*this.props.newsItems.filter(filterForText, this).map(makeList) */}
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
  	      <input 	className="form-control"
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
  handleClick2: function(e) {
    console.log('button', e.currentTarget.getAttribute('value'));
    e.preventDefault();
    this.props.onTagClick('egypt');
  },
	render: function() {
    var that = this;
    var makeList = function(x) {
      return <li key={x}><button type="button" value={x} onClick={that.handleClick}>{x}</button></li>
    }    
    return (
      <ul id="tagList">{ this.props.filterTags.map(makeList) }</ul>
    );
	}
});

var NewsApp = React.createClass({
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
      <div id="mainContent">
        <div id="headerInfo">
          <NewsItemCount itemCount={ this.state.newsItems.length }/>
          <NewsTimeSpent timeSpent={ this.state.startTime }/>
          <NewsReaderCount readerCount={this.state.numberOfReaders}/>
          <NewsSearchBar onUserInput={ this.handleUserInput } filterText={this.state.filterText} onFilterSubmit={this.handleSubmit}/>      
          <NewsTagList filterTags={ this.state.filterTags} onTagClick={this.handleTagClick}/>
        </div>
      <div>
        <div id="mainList">
          <NewsList newsItems={this.state.newsItems} filterText={this.state.filterText.toLowerCase()} filterTags={this.state.filterTags}/>
        </div>        
      </div>
      </div>
		);
	}
});

React.render(<NewsApp />, document.getElementById('newslistr'));
