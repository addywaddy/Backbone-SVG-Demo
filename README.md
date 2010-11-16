# Backbone Presentation with SVG Demo

Presented at November's BerlinJS meetup on 18.11.2010

## Prerequisites

You'll need Node and CouchDB installed.

### Node JS Libraries

- node-couchdb (install via npm or see below)
- underscore (install via npm or see below)
- autobahn

Autobahn is my own attempt to get to know node a little better. It's a simple router supporting nested routes. It's not avaliable via npm so just clone it and symlink it.

Autobahn isn't essential for the demo however, so you can integrate the responses into your node web framework of choice and it should work :)

After all that, run `node init.js` to setup the couchdb database, start the app with `node demo.js` and point your browser at localhost:4321

## Documentation

I've documented app.js. In order to view it, make sure you've installed the wonderful docco (http://jashkenas.github.com/docco/) and then run `docco public/js/app.js`.
