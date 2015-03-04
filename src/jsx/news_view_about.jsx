var HowCow = React.createClass({
	render: function() {
		return (
			<div id="aboutCow">

        <h2 id="cowwhat">What?</h2>                
          
        <p>This feed won't give you instant gratification. At first it won't give you anything. It's intended
        for grazing. Come back in a few minutes or maybe more, and you can see the news will start to filter
        in.</p>
      
        <p>Don't fret if you begin to see things you don't like. It's simple to filter.</p>
        
        <p>If you have a smaller appetite for humour, type <code>'-theonion.com'</code> into the filter box (be
        mindful of the dash out front). Conversely, do you really enjoy stories about Australia? Or Beef? Enter
        those words into the filter box. I can remember more than one. Click the tags to remove them and it's
        like they were never there.</p>

        <p>Curious about where this news comes from? Click the word 'Sources'.</p>

        <p>Take your time, the news won't stop. Even as you read this.</p>
      
        <h2 id="cowwhy">Why?</h2>
      
        <p>I like reading news, and I like programming. You could also say I like to reinvent the wheel, but
        take a closer look and you may agree this feed is a little different.</p>

        <p>This site is intended for slow movers and not those who find themselves in a hurry. It intentionally
        shows nothing when you load it, and from then it will only show news as it is published. It's about the
        present, at a speed you can work with.</p>

        <p>You cannot set the source of the news, but you can curate with broad, simple strokes. Searching is
        fast and efficient too.</p>

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