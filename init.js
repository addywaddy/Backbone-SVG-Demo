require("underscore")

var
  dbName      = 'backbone-svg-demo'
  designDocId = "_design/drawing"
  couchdb     = require('couchdb'),
  client      = couchdb.createClient(5984, 'localhost'),
  db          = client.db(dbName)

db.create()

var designDoc = {
  views: {
    circles: {
      map: function(doc) {
        emit(doc['sortKey'], doc);
      }
    }
  }
}

db.saveDesign(designDocId, designDoc, function(err, succ) {

  if (succ) return

  if (err && err.error == 'conflict') {
    // We're updating. Get the latest rev and replace
    db.getDoc(designDocId, function(err, doc) {
      if (doc) {
        db.saveDesign(_.extend(doc, designDoc), function(err, succ) {
          if (err) console.log(err)
        })
      }
    })
  }
})