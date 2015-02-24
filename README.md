# News Aggregator

A simple aggregator that uses sockets to send news to the user.

News feeds are fetched periodically and stored inside a MongoDB database.
These are then sent to the client. A user count is also shared among the user sessions globally.

Facebook's React is used for client side rendering.

## Usage

You will need MongoDB and NPM installed.

Clone the repository and install the necessary dependencies:

    git clone https://github.com/colw/nxws.git
    cd nxws
    npm install

Then create a directory for the database and run MongoDB in the background:

    mkdir data
    mongod --fork --logpath ./mongodb.log --dbpath=./data --port 27017
    
Now run the app

    node app.js
    
    
