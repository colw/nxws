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
  handleClick: function() {
    this.props.onClickHandler();
  },
	render: function() {
    var randElt = this.getRandomInteger(0, this.state.cowords.length);
    var saying = this.state.cowords[randElt];
		return (
      React.createElement("div", {id: "cow", onClick: this.props.onClickHandler}, 
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


