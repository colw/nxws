var socket = io();

var storage = new ObservableThing([]);
function getStateFromStorage() {
  return {
    newsItems: storage.get()
  };
}

var numberOfReaders = new ObservableThing(Number(0));
function getStateFromNumberOfReaders() {
  return {
    numberOfReaders: numberOfReaders.get()
  };
}

socket.on('nxws items', function(msg) {
	var newItem = JSON.parse(msg);
  newItem.date = new Date(newItem.date);
  if (newItem.constructor == Object) newItem = [newItem];
  var currentNews = storage.get();
  var totalNews = newItem.concat(currentNews)
  storage.set(totalNews);
});

socket.on('nxws readers', function(msg) {
  console.log('Readers:', msg);
  numberOfReaders.set(Number(msg));
});


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
  getInitialState: function() {
    return getStateFromNumberOfReaders();
  },
  componentDidMount: function() {
    numberOfReaders.setChangeListener(this.onReaderChange);
  },
  onReaderChange: function() {
    this.setState(getStateFromNumberOfReaders());
  },
	render: function() {
		return (
      <div id="readerCount">
        { this.state.numberOfReaders + ' Online'}
      </div>
		);
	}
});

var NewsList = React.createClass({
  getInitialState: function() {
    return getStateFromStorage()
  },
  componentDidMount: function() {
    storage.setChangeListener(this.onStorageChange);
  },
  onStorageChange: function() {
    this.setState(getStateFromStorage());
  },
	render: function() {
    if (this.state.newsItems.length == 0) {
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
  		return (
  			<ul>
  				{ this.state.newsItems.filter(filterForText, this).map(makeList) }
  			</ul>
  		);
    }
	}
});

var NewsClock = React.createClass({
  getInitialState: function() {
    return {theTime: new Date()}
  },
  componentDidMount: function() {
    this.interval = setInterval(this.updateClock, 500);
  },
  updateClock: function() {
    this.setState({theTime: new Date()});
  },
  render: function() {
    var theTime = this.state.theTime;
    var formatttedTime = [theTime.getHours(), theTime.getMinutes(), theTime.getSeconds()]
                         .map(function(x) {return x < 10 ? '0' + x : x;}).slice(0,3).join(':');
    return (
      <div id="clock">{formatttedTime}</div>
    );
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
	render: function() {
    return (
      <div>
	      <input 	className="form-control"
    			ref="filterTextInput"
    			value={this.props.filterText}
    			type="search" onChange={this.handleChange}
    			placeholder="Filter"/>
      </div>
		);
	}
});

var NewsApp = React.createClass({
  getInitialState: function() {
    return {startTime: new Date(), filterText: ''};
  },
	handleUserInput: function (filterText) {
		this.setState({filterText: filterText});
	},
	render: function() {
    return (
      <div>
        <div id="headerInfo">
          <NewsSearchBar  onUserInput={this.handleUserInput} filterText={this.state.filterText} />      
          <NewsReaderCount />  
          {/* <NewsClock /> */}
        </div>
        <div id="mainList">
          <NewsList filterText={this.state.filterText.toLowerCase()} />
        </div>        
      </div>
		);
	}
});

React.render(<NewsApp />, document.getElementById('newslistr'));
