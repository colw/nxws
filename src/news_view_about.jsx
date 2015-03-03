var HowCow = React.createClass({
	render: function() {
		return (
			<div id="aboutCow">

                <h2 id="cowwhat">What?</h2>                
                    
                <p>This feed won't give you instant gratification. At first it
                won't give you anything. It's intended for a grazer. Come back
                in a few minutes or maybe more, and you can see the news will
                start to filter in.</p>
                
                <p>Don't fret if you begin to see things you don't like.
                Vanish them. If you have a smaller appetite for humour, type
                <em> '-theonion.com'</em> into the filter box (be mindful of
                the dash out front). It's ok, no one will know.</p>
                
                <p>Conversely, do you really enjoy stories about Australia? Or
                Beef? <em>Enter</em> those words into the small box. Separately
                if you please, but don't fret, I can remember more than one.</p>
                
                <p>Click the tags to remove them. It's like they were never
                there.</p>

                <p>Curious about where this news comes from? I'll show you.
                Click the word 'Sources'.</p>
          
                <p>Take your time, don't fret, the news won't stop. Even as you
                read this.</p>
                
                <h2 id="cowwhy">Why?</h2>
                
                <p>I like reading news, and I like programming. You could also
                say I like to reinvent the wheel, but take a closer look and
                you may agree this feed is a little different.</p>

                <p>This site is intended for grazers and not those who find
                themselves in a hurry. It intentionally shows nothing when you
                load it, and from then it will only show news as it's
                published. It's about the present, at a speed you can work
                with.</p>

                <p>You can't set the source of the news, but you can curate
                with broad, simple strokes. Searching is fast and efficient
                too.</p>

                <h2 id="cowhow">How?</h2>
                
                <p>Technically speaking, there is a <a href="http://www.nodejs.org" target="_blank">Node.js</a> backend on the look out for news. When it finds some, it will
                send it straight to your browser using <a
                href="http://socket.io" target="_blank">Socket.io</a>. The
                whole rendering experience is based upon <a
                href="http://facebook.github.io/react"
                target="_blank">React</a>.</p>
        
                <p>That's about enough tech speak for here. Read the <a
                href="http://github.com/colw/nxws" target="_blank">code</a> if
                you're curious.</p>

            </div>
		);
	}
});