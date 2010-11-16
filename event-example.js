Backbone = require('backbone')

var Car = Backbone.Model.extend({
  initialize: function() {
    var self = this

    this.bind("drive", function() {
      self.releaseHandbrake()
    })
  },

  start: function() {
    console.log("Engine is running")
    this.trigger("drive")
  },

  releaseHandbrake: function() {
    console.log("Handbreak released")
  }
})

var myCar = new Car()

myCar.start()