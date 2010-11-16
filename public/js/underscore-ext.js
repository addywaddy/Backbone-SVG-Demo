_.mixin({
  except : function(obj, aryOrStr) {
    var keys = typeof(aryOrStr) == "string" ? [aryOrStr] : aryOrStr

    var rtn = _.clone(obj)
    _.each(keys, function(key) {
      delete rtn[key]
    })
    return rtn
  }
});