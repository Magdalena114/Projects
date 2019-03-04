//'use strict';
// Be sure to mention eslint --global d3,_ clean_viz.js

!function() {
  var od = {};

  // Putting prototypes and other "dangerous" global changes at the top!

  /**
   * Sort an array of *objects*, in place, by a dimension of the object.
   * Sorts in ascending order by default.
   * @example
   * // returns nothing, but tmp is now
   * //   [{'dim1': 3, 'dim2': 15}, {'dim1': 7, 'dim2': 10}]
   * tmp = [{'dim1': 7, 'dim2': 10}, {'dim1': 3, 'dim2': 15}] ; tmp.sortBy('dim1')
   * @example
   * // returns nothing, but tmp is now
   * //   [{'dim1': 7, 'dim2': 10}, {'dim1': 3, 'dim2': 15}]
   * tmp = [{'dim1': 7, 'dim2': 10}, {'dim1': 3, 'dim2': 15}] ; tmp.sortBy('dim1', ascending=false)
   * @param {string} data_dim The object key to use for sorting.
   * @param {boolean} [ascending=true] Sort in ascending or descending order.
   * @returns {undefined}
   */
  Array.prototype.sortBy = function(data_dim, ascending = true) {
    // This "hasOwnProperty" method has some weaknesses that I am ignoring.  See the following:
    // http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
    if (ascending) {
      this.sort(function(elem1, elem2) {
        return d3.ascending(elem1[data_dim], elem2[data_dim]);
      });
    } else {
      this.sort(function(elem1, elem2) {
        return d3.descending(elem1[data_dim], elem2[data_dim]);
      });
    }
  };

  /**
   * Round a number to the *left* side of the decimal.
   * @example
   * // returns 143600
   * od.roundPretty(143649.57, 2)
   * @example
   * // returns 143649.6 (But normal JS rounding functions capture this, too.)
   * od.roundPretty(143649.57, -1)
   * @param {number} value Input value to be rounded
   * @param {number} digits Number of places, or digits, to move to the left
   * @returns {number} rounded number
   */
  od.roundPretty = function(value, digits = 0) {
    var mltplyr = Math.pow(10, digits);
    return Math.round(value / mltplyr) * mltplyr
  };

  /**
   * Replace object names with those found in a dictionary of fixes.
   * Replacements are made in-object. (This is tailored to a TopoJSON
   * file structure.)
   * @param {Object[]} topo_map TopoJSON object, altered via topojson.feature.
   * @param {Object} fixed_names Mapping from incorrect to correct naming.
   * @param {string} topo_key Final level key to find the object names.
   * @param {string} [topo_property='properties'] Topo properties level key.
   * @returns {undefined}
   */
  od.fixNaming = function(topo_map, fixed_names, topo_key,
                          topo_property='properties') {
    var key;
    topo_map.forEach(function(elem) {
      key = Object.keys(fixed_names).find(function(d) {
        return d === elem[topo_property][topo_key];
      });
      if (key !== undefined) {
        elem[topo_property][topo_key] = fixed_names[key];
      }
    });
  };

  od.addDataToMap = function(topo_map, data, data_key, topo_key, data_obj_name,
                             topo_property='properties', ignore_case=true) {
    topo_map.forEach(function(elem) {
      elem[data_obj_name] = data.find(function(d) {
        if (ignore_case) {
          return d[data_key].toUpperCase() ===
            elem[topo_property][topo_key].toUpperCase();
        } else {
          return d[data_key] === elem[topo_property][topo_key];
        }
      });
    });
  };


  od.nestSummarize = function(raw_data, lvls, avg_labels) {
    // Capture data elements for averaging Age.
    // (Note:  Employment status is ignored for now, but kept "just in case".)
    var nest_raw = _.map(raw_data, function(elem) {
          return _.pick(elem, lvls);
        });
    
    // Create the nested structure for sunnarizing arrests.
    var nested_data = d3.nest().key(function(elem) {
          return elem['Education Level'];
        })
        .entries(nest_raw);

    // Summarize .
    nested_data.forEach(function(elem) {
      for (i = 0; i < avg_labels.length ; i++) {
      elem[avg_labels[i]] = elem.values.reduce(function(total, elem) {
        return total + elem[lvls[i+1]];
      }, 0)/100;
    }
    });
    return nested_data;
  };


  od.filterSummarize = function(raw_data, uniq_lvl) {
    // Capture neighborhood data elements.
    var locale_data = _.map(raw_data, function(elem) {
          return _.pick(elem, uniq_lvl);
        });

    // Remove duplicate elements.
    locale_data = _.uniqBy(locale_data, function (elem) {
      return elem[uniq_lvl];
    });

    return locale_data;
  };


  od.organizeData = function(incoming_data, nest_lvl = 'Education Level',
                             avg_lvls = ['Age' , 'Children','Weekly Hours Worked','Sleeping',
                            'Housework','Caring for Children', 'Shopping','Television'],
                             avg_labels = ["Average Age" , "Average number of children", "Average weekly worked hours",
                             "Average daily sleeping minutes", "Average daily housework minutes" , "Average daily childcare minutes" ,
                             "Average daily shopping minutes" , "Average daily TV minutes"],
                             avg_attribs = ['Employment Status'],
                             filter_lvl = 'Education Level' ) {
    // Filter out elements without a neighborhood.
    incoming_data.forEach(function(elem) {
      if (elem[nest_lvl] === null) {
        elem[nest_lvl] = "unknown";
      }
    });
    avg_lvls.unshift(nest_lvl);
    var nested_data = od.nestSummarize(incoming_data, avg_lvls, avg_labels);
    
    var filtered_data = od.filterSummarize(incoming_data, filter_lvl);

    
    //Merge the nested and filtered data.
    filtered_data.forEach(function(filtered_elem) {
      var nested_obj = nested_data.find(function(nested_elem) {
        return nested_elem.key === filtered_elem[filter_lvl];
      });
      for (i = 0; i < avg_labels.length ; i++) {
      filtered_elem[avg_labels[i]] = nested_obj[avg_labels[i]];
      }
    });
    
    return filtered_data; 
    
  };

  /**
   * Callback for reading SVG file and generating HttpRequest.
   *
   * @callback od.readSvgCallback
   * @param {Object} error The error captured from a poor request.
   * @param {Object} data An XMLHttpRequest object generated from request.
   */

  /**
   * Create a request for an SVG file, to be consumed by a d3 html function.
   * In practice, this is used to read in the University of the Pacific logo.
   * @example
   * // returns an HttpRequest generated from "Pacific_Logo.svg" file
   * od.readSvg("../images/Pacific_Logo.svg", function(err, data) { console.log(data); })
   * @param {string} svg_path Path for SVG file to be requested.
   * @param {od.read_svgCallback} callback Capture error, or data from request
   * @returns {Object} XMLHttpRequest generated from reading SVG file.
   */

  od.readSvg = function(svg_path, callback) {
    d3.xml(svg_path).mimeType("image/svg+xml")
      .get(function(err, xml) {
         if (err) {
           throw err;
         }
         callback(null, xml.documentElement.outerHTML);
       });
  };

  if (typeof define === "function" && define.amd) {
    this.od = od, define(od);
  } else if (typeof module === "object" && module.exports) {
    module.exports = od;
  } else {
    this.od = od;
  }
}();
