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
  handleClick: function() {
    this.props.onClickHandler();
  },
	render: function() {
    var randElt = this.getRandomInteger(0, this.state.cowords.length);
    var saying = this.state.cowords[randElt];
		return (
      <div id="cow" onClick={this.props.onClickHandler}>
        <img src={this.state.cow} alt="A black and white cow" title={saying} />
      </div>
		);
	}
});

var NewsReaderCount = React.createClass({
	render: function() {
    var text = '';
    switch (this.props.readerCount) {
      case 0: text = 'With No Others'; break;
      case 1: text = 'With 1 Other'; break;
      default: text = 'With ' + this.props.readerCount + ' Others'; break;
    }    
		return (
      <span id="readerCount">
        { text } 
      </span>
		);
	}
});

var NewsItemCount = React.createClass({
	render: function() {
    var itemCount = this.props.itemcount;
    var updateText = '';
    switch (itemCount) {
      case 0: updateText = 'No News'; break;
      case 1: updateText = '1 Update'; break;
      default: updateText = itemCount + ' Updates'; break;
    }
		return (
      <span id="itemCount">{updateText}</span>
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
  handleSubmit: function(e) {
    e.preventDefault();
    var filterText = this.refs.filterTextInput.getDOMNode().value;
    this.props.onFilterSubmit(filterText);
  },
	render: function() {
    return (
      <div id="filterBox">
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
      return <li key={x} className="sourceItem">{x}</li>
    }
    var elt = null;
    if (this.state.showSources) {
      elt = <ul>{ this.props.sourceList.map(makeList) }</ul>
    }
    return (
      <span id="sourceList" onClick={this.handleClick}>
        {'from ' + this.props.sourceList.length + ' Sources' }
        {elt}
      </span>
    );
	}
});

var NewsDuration = React.createClass({
	render: function() {
    var duration = this.props.duration;
    var text = 'in ' + duration + (duration == 1 ? ' Minute' : ' Minutes');
    return (
      <span>{text}</span>
    );
  }
});

var NewsInfo = React.createClass({
	render: function() {
    return (
      <div id="newheader">
          <NewsItemCount itemcount={this.props.itemcount}/> <NewsDuration duration={this.props.minutes} /> <NewsSources sourceList={this.props.sources} />  
      </div>
    );
  }
});


