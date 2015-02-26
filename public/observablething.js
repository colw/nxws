var ObservableThing = function(thing) {
  this.thing = thing;
  this.onChangeListener = null;
}

ObservableThing.prototype.set = function(newValue) {
  this.thing = newValue;
  this.notify();
}

ObservableThing.prototype.get = function() {
  return this.thing;
}

ObservableThing.prototype.setChangeListener = function(listener) {
  this.onChangeListener = listener;
}

ObservableThing.prototype.notify = function() {
  if (this.onChangeListener != null) {
    this.onChangeListener();
  }
}
