var HowCow = React.createClass({
	render: function() {
		return (
			<div id="aboutCow">

        <h2 id="cowwhat">What?</h2>                
          
        <p>This is a world news feed. Give it a minute or two for items to be published.</p>
                    
        <p>It's very easy to search or filter by typing in the box. Instant actually. If you want to keep it,
        just hit enter and the term will be added to a tag list. You can stack filter tags on top of each other.</p>
          
        <ul className="tutTags">
          <li className="tagItem tagInclude"><button type="button">Highland Cows</button></li>          
          <li className="tagItem tagInclude"><button type="button">Mountain Goats</button></li>          
        </ul>

        <p>As an extra, place a dash (-) at the beginning of the term and you can choose what not to see.</p>
          
        <ul className="tutTags">
          <li className="tagItem tagExclude"><button type="button">Beef</button></li>          
        </ul>

        <p>Tags are colour coded, so you will know how the list is being filtered. If you want to remove it, just click
        it. It's like they were never there. Magic.</p>
              
        <p>Click the word 'Sources' (just above the cow) if you wish to see where the news comes from.</p>

        <p>Take your time, the news will keep coming even as you read this.</p>
      
        <h2 id="cowwhy">Why?</h2>
      
        <p>I like reading news, and I like programming. You could also say I like to reinvent the wheel, but
        take a closer look and you may agree this feed is a little different.</p>
      
        <p>You cannot set the source of the news, but you can curate with broad, simple strokes, by using tagging.
        Searching is fast too.</p>

        <p>This site is intended for slow movers and not those who find themselves in a hurry. It intentionally
        shows nothing when you load it, and from then it will only show news as it is published. It's about the
        present, at a speed you can work with.</p>

        <h2 id="cowhow">How?</h2>
      
        <p>Technically speaking, there is a <a href="http://www.nodejs.org" target="_blank">Node.js</a> back end
        on the look out for news. When it finds some, it will send it straight to your browser using <a
        href="http://socket.io" target="_blank">Socket.io</a>. The whole rendering experience is based upon <a
        href="http://facebook.github.io/react" target="_blank">React</a>. </p>
      
        <p><a href="http://gulpjs.com" target="_blank">Gulp</a> is a big help too, but that's about enough
        tech. Read the <a href="http://github.com/colw/nxws" target="_blank">code</a> if you're curious.</p>
        
        <h2 id="cowwho">Who?</h2>
        
        <p id="smallwho">I can be reached <a href="mailto:colw@outlook.com">here</a>.</p>

      </div>
		);
	}
});