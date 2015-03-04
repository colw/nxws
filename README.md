# News Aggregator

A simple node news aggregator that uses sockets to communicate with the user.

News feeds are fetched periodically and if the date of the article is a recent one, send it to the users.

- [Node.js](http://nodejs.org) Runs the server and periodically checks and parses feeds.
- Thanks to [Feed Parser](https://github.com/danmactough/node-feedparser) for the feed parsing.
- [Socket.io](http://socket.io) is used for communicating with the browser.
- Facebook's [React](http://facebook.github.io/react) is used to render in the browser.
- [Gulp](http://gulpjs.com) watches over your files, and transforms JSX and SASS for you automatically.

## Install and Run

You will need `node` and `npm` installed.

Clone the repository, install the necessary dependencies and run:

    git clone https://github.com/colw/nxws.git
    cd nxws
    npm install
    node app.js

Then proceed to [http://localhost:5000](http://localhost:5000) to view.

If you want to make any changes, run `gulp` in the main directory. That will watch and copy over any changes to the
`dist` directory, which pages are served from. Transforming them if necessary.

## Usage

The filter box can be used to broadly filter the news that's come in. It will search on the title, link and meta.link
of the news item. Type what you want and the list will change in real time. Hit enter to confirm the change and add the
tag to a list.

If you wish to exclude items, place a '-' out the front of the filter you are entering.
    
    
