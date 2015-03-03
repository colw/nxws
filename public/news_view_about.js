var HowCow = React.createClass({displayName: "HowCow",
	render: function() {
		return (
			React.createElement("div", {id: "aboutCow"}, 

                React.createElement("h2", {id: "cowwhat"}, "What?"), 
                    
                React.createElement("p", null, "This feed won't give you instant gratification. At first it" + ' ' +
                "won't give you anything. It's intended for a grazer. Come back" + ' ' +
                "in a few minutes or maybe more, and you can see the news will" + ' ' +
                "start to filter in."), 
                
                React.createElement("p", null, "Don't fret if you begin to see things you don't like." + ' ' +
                "Vanish them. If you have a smaller appetite for humour, type", 
                React.createElement("em", null, " '-theonion.com'"), " into the filter box (be mindful of" + ' ' +
                "the dash out front). It's ok, no one will know."), 
                
                React.createElement("p", null, "Conversely, do you really enjoy stories about Australia? Or" + ' ' +
                "Beef? ", React.createElement("em", null, "Enter"), " those words into the small box. Separately" + ' ' +
                "if you please, but don't fret, I can remember more than one."), 
                
                React.createElement("p", null, "Click the tags to remove them. It's like they were never" + ' ' +
                "there."), 

                React.createElement("p", null, "Curious about where this news comes from? I'll show you." + ' ' +
                "Click the word 'Sources'."), 
          
                React.createElement("p", null, "Take your time, don't fret, the news won't stop. Even as you" + ' ' +
                "read this."), 
                
                React.createElement("h2", {id: "cowwhy"}, "Why?"), 
                
                React.createElement("p", null, "I like reading news, and I like programming. You could also" + ' ' +
                "say I like to reinvent the wheel, but take a closer look and" + ' ' +
                "you may agree this feed is a little different."), 

                React.createElement("p", null, "This site is intended for grazers and not those who find" + ' ' +
                "themselves in a hurry. It intentionally shows nothing when you" + ' ' +
                "load it, and from then it will only show news as it's" + ' ' +
                "published. It's about the present, at a speed you can work" + ' ' +
                "with."), 

                React.createElement("p", null, "You can't set the source of the news, but you can curate" + ' ' +
                "with broad, simple strokes. Searching is fast and efficient" + ' ' +
                "too."), 

                React.createElement("h2", {id: "cowhow"}, "How?"), 
                
                React.createElement("p", null, "Technically speaking, there is a ", React.createElement("a", {
                href: "http://www.nodejs.org"}, "Node.js"), " backend on the look" + ' ' +
                "out for news. When it finds some, it will send it straight to" + ' ' +
                "your browser using ", React.createElement("a", {href: "http://socket.io"}, "Socket.io"), "." + ' ' +
                "The whole rendering experience is based upon ", React.createElement("a", {
                href: "http://facebook.github.io/react"}, "React"), "."), 
        
                React.createElement("p", null, "That's about enough tech speak for here. Read the ", React.createElement("a", {
                href: "http://github.com/colw/nxws", target: "_blank"}, "code"), " if" + ' ' +
                "you're curious.")

            )
		);
	}
});