// ## Slideshow

// Our slideshow controller. We listen to the hashtag change, retrieve the relevent slide and update the hrefs for the previous and next links.
var Slideshow = Backbone.Controller.extend({

  routes: {
    "slide/:no":            "openSlide"
  },

  openSlide: function(no) {
    $.ajax({
      type: "GET",
      url: '/slides/' + no + '.html',
      success: function(response) {
        $("#slide-content").html(response)
        $("#previous").attr("href", "#slide/" + (parseInt(no) - 1))
        $("#next").attr("href", "#slide/" + (parseInt(no) + 1))
        if (no == '1'){
          $("#previous").hide()
        } else {
          $("#previous").show()
        }
      }
    })
  }
})

// ##SVG Demo
//
function setupDrawing () {

  // Setup our SVG namespace
  var SVGNS = 'http://www.w3.org/2000/svg'

  // ### Styles

  // We'll be using an instance of this for tracking the current style settings.
  var Style = Backbone.Model.extend({})

  // Here's it's view.
  var StyleView = Backbone.View.extend({

    initialize: function() {
      // Populate it's input fields with the relevant `Style` attributes from our model instance.
      _.each($(this.el).find("input"), function(input) {
        var attrName = $(input).attr("name")
        $(input).val(window.Style.get(attrName))
      })
    },

    // The selector whose events we will be listening in on.
    el: "#style",

    // Specifically `keydown`, to update our Style with attributes as they're typed in.
    events: {
      "keydown": "updateAttribute"
    },

    updateAttribute: function(e) {

      var el = $(e.target)

      var self = this

      // Need a timeout to avoid missing the last keydown.
      setTimeout(function() {
        var attr = {}
        attr[el.attr("name")] = el.val()
        // Update our model accordingly
        self.model.set(attr)
      }, 10);
    }
  })

  // ### Circles

  // Our Circle model. Nothing special here.
  var Circle = Backbone.Model

  // Here's it's view.
  var CircleView = Backbone.View.extend({

    // Our render function adds a `<circle>` element containing the model instances attributes.
    render : function() {
      var el = document.createElementNS(SVGNS, 'circle');
      _(this.model.attributes).each(function(v, k) {
        el.setAttribute(k, v)
      })
      return el;
    }

  })

  // ### Drawing

  // This is where the circles are added.
  var Drawing = Backbone.Collection.extend({
    initialize: function() {

      // Added circles are ...
      this.bind("add", function(model) {

        // saved and if successsful ...
        model.save(null, {
          success: function(model, resp) {
            // rendered.
            var view = new CircleView({model: model})
            $("#drawing").append(view.render())
          }
        })
      })

      // Render all circles contained in the collection on initialisation
      _.each(this.models, function(model) {
        var view = new CircleView({model: model})
        $("#drawing").append(view.render())
      })
    },

    // The url from which we GET our saved circle instances and to which we POST the new ones.
    url: '/circles'
  })

  // The view for managing the drawing space
  var DrawingView = Backbone.View.extend({

    // Our svg's id
    el: "#drawing",

    // Add a circle when the svg is clicked on
    events: {
      "click": "addCircle"
    },

    // The circle is instantiated using our `Style`'s attributes as well as the mouse cursors coords.
    addCircle: function(e) {
      var offset = $("#svg-container").offset()
      var circle = new Circle(_.extend(window.Style.attributes,{cx: e.pageX - offset.left + "px", cy: e.pageY - offset.top + "px", opacity: window.Style.get("opacity") }))

      // Add our new `Circle` to the `Drawing` collection, thus firing save and render
      window.Drawing.add(circle)
    }
  })

  // Use document.createElementNS to insert our `<svg>` into the page
  function addSVG (containerId) {

    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('id', "drawing");
    svg.setAttribute('width', "800px");
    svg.setAttribute('height', "400px");
    svg.setAttribute('viewBox', "0 0 800 400");

    $(containerId).html(svg)
  }

  // add the `<svg>`
  addSVG("#svg-container")

  // Grab any existing circles from the backend
  $.ajax({
    type: "GET",
    url: '/circles',
    dataType: 'json',
    success: function(response) {

      var circles = _.map(response, function(el) {
        return new Circle(el)
      })

      // Populate the `Drawing` collection with circles from the backend
      window.Drawing = new Drawing(circles)
    }
  })

  // Initialise our `Drawing` view (ie. the `<svg>`)
  window.DrawingView = new DrawingView

  // Create our style with default values
  window.Style = new Backbone.Model({
    "r"               :     20,
    "stroke-width"    :      1,
    "fill"            : "#eee",
    "stroke"          : "#000",
    "opacity"         : 1
  })

  // Associate our `StyleView` with the `Style` instance
  window.StyleView = new StyleView({model: window.Style})
}

  // ### Start 'er up.
$(document).ready(function(){

  // initialise our `Slideshow` Controller
  window.Slideshow = new Slideshow()

  // Start listening for hashtag changes.
  Backbone.history.start();

})
