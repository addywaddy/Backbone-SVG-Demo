var
  autobahn  = require('/u/src/github/addywaddy/autobahn/lib/autobahn'),
  sys       = require('sys'),
  couchdb   = require('couchdb'),
  client    = couchdb.createClient(5984, 'localhost'),
  db        = client.db('backbone-svg-demo')

var app = autobahn(function() {

  this.get("/", function(req, res) {
    autobahn.render(req, res, "index.html")
  })

  this.get("/circles", function(req, res, params) {

    db.view("drawing", "circles", {startkey: null, endkey: {}}, function(er, result) {
      if (er) sys.puts(JSON.stringify(er))

      var circles

      if (_.isEmpty(result.rows)) {
        circles = []
      } else {
        circles = _.map(result.rows, function(circle) { return circle.value})
      }

      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(circles) + '\n')
    })

  })
    .post(function(req, res) {

      var body = ""

      req.addListener("data",function(data){
          body += data
      });

      req.addListener("end",function(){
        db.saveDoc(_.extend(JSON.parse(body), {sortKey: new Date()}), function(er, ok) {
          if (er) sys.puts(JSON.stringify(er))
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(JSON.stringify(ok) + '\n')
        })
      })
    })

})({ port: 4321 })
