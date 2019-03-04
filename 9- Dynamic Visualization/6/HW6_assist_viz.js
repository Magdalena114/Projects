//'use strict';
// Be sure to mention eslint --global d3,_ clean_viz.js

!function() {
  var av = {};

  // Putting prototypes and other "dangerous" global changes at the top!
  // These clever prototype functions were found here:
  // http://stackoverflow.com/questions/14167863/
  //        how-can-i-bring-a-circle-to-the-front-with-d3
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

  d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
      var firstChild = this.parentNode.firstChild; 
      if (firstChild) { 
        this.parentNode.insertBefore(this, firstChild); 
      } 
    }); 
  };

  av.roundPretty = function(value, digits) {
    var mltplyr = Math.pow(10, digits);
    return Math.round(value / mltplyr) * mltplyr
  };

  if (typeof define === "function" && define.amd) {
    this.av = av, define(av);
  } else if (typeof module === "object" && module.exports) {
    module.exports = av;
  } else {
    this.av = av;
  }
}();

