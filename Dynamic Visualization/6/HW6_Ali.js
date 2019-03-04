'use strict';

var parm = {
  'education': {
    'tag': "#education", 
    'name': "Education Level", 
    'text': "Education Level"
  },
  'mean_age': {
    'tag': "#mean_age", 
    'name': "Average Age", 
    'text': "Average Age"
  },
  'mean_children': {
    'tag': "#mean_children", 
    'name': "Average number of children",
    'text': "Average number of children"
  },
  'mean_work': {
    'tag': "#mean_work",
    'name': "Average weekly worked hours",
    'text': "Average weekly worked hours"
  },
  'mean_sleep': {
    'tag': "#mean_sleep", 
    'name': "Average daily sleeping minutes",
    'text': "Average daily sleeping minutes"
  },
  'mean_housework': {
    'tag': "#mean_housework", 
    'name': "Average daily housework minutes", 
    'text': "Average daily housework minutes"
  },
  'mean_childcare': {
    'tag': "#mean_childcare", 
    'name': "Average daily childcare minutes", 
    'text': "Average daily childcare minutes"
  },
  'mean_shopping': {
    'tag': "#mean_shopping", 
    'name': "Average daily shopping minutes",
    'text': "Average daily shopping minutes"
  },
  'mean_tv': {
    'tag': "#mean_tv", 
    'name': "Average daily TV minutes", 
    'text': "Average daily TV minutes"
  }
};

var dim = {
  'margin': {
    'top': 40,
    'right': 0,
    'bottom': 40,
    'left': 60
  },
  'padding': {
    'top': 40
  },
  'tooltip': {
    'width': 100,
    'height': 250,
    'horiz_ratio': 0.4,
    'vert_ratio': 0.6
  },
  'legend': {
    'width': 300,
    'height': 100
  },
  
  'icon_size': 45,

  'size_range': [0.2, 0.4, 1],
  
  'stroke_range': [50, 2000],
  'line_height': 40,
  'transition': 600,
  'delay': 20,
  'hover': {
    'fill': 'purple',
    'opacity': 1
  },
  'unfocus': {
    'fill': 'none',
    'opacity': 0.2
  },
  'normal': {
    'fill': 'none',
    'opacity': 1
  },
  'clicked': {
    'fill': '#FF5A1C',
    'opacity': 1
  }
};

dim.width = 700 - dim.margin.left - dim.margin.right;
dim.height = 500 - dim.margin.top - dim.margin.bottom;
dim.tooltip.horiz_bump = 0.25 * dim.width;
dim.tooltip.vert_bump = 0.3 * (dim.height - dim.tooltip.height);


dim.padding.left = dim.size_range[2] * dim.icon_size;
dim.padding.right = dim.size_range[2] * dim.icon_size;
dim.padding.top = dim.padding.top + (dim.size_range[2] * dim.icon_size);
dim.padding.bottom = dim.size_range[2] * dim.icon_size;


var clicked = {
  'x': parm[d3.select("div#x_controls")
              .selectAll("button.clicked").attr("id")],
  'y': parm[d3.select("div#y_controls")
              .selectAll("button.clicked").attr("id")],
  'size': parm[d3.select("div#size_controls")
                 .selectAll("button.clicked").attr("id")],
  'color': parm[d3.select("div#color_controls")
                  .selectAll("button.clicked").attr("id")],
  'stroke': parm[d3.select("div#stroke_controls")
                   .selectAll("button.clicked").attr("id")]
};

var xScale = d3.scaleLinear()
               .range([dim.padding.left, dim.width - dim.padding.right]);
var yScale = d3.scaleLinear()
               .range([dim.height - dim.padding.bottom -
                  dim.legend.height, dim.padding.top]);
var sizeScale = d3.scaleLinear()
                  .range([dim.size_range[0], dim.size_range[2]]);
var strokeScale = d3.scaleLinear()
                    .range(dim.stroke_range);

var colorScale = d3.scaleQuantize()
                   .range(colorbrewer.RdYlBu['8']);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);


var legend = d3.svgLegend().unitLabel("");


var svg = d3.select("div#viz").append("svg")
            .attr("width", dim.width + dim.margin.left + dim.margin.right)
            .attr("height", dim.height + dim.margin.top + dim.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + dim.margin.left + "," +
              dim.margin.top + ")");

svg.append("text")
   .classed("title", true)
   .attr("id", "title1")
   .attr("x", dim.width / 2)
   .attr("y", 0);
svg.append("text")
   .classed("title", true)
   .attr("id", "title2")
   .attr("x", dim.width / 2)
   .attr("y", dim.line_height);

// Create DOM elements for the axes and their labels
svg.append("g").attr("id", "xAxis").classed("axis", true)
   .attr('transform', 'translate(0,' + (dim.height - dim.legend.height) + ')');
svg.append("text").attr("id", "xLabel").classed("axis", true)
   .attr("text-anchor", "middle")
   .attr("x", dim.width / 2)
   .attr("y", dim.height - dim.legend.height + dim.line_height);

svg.append("g").attr("id", "yAxis").classed("axis", true);
svg.append("text").attr("id", "yLabel").classed("axis", true)
   .attr("text-anchor", "middle")
   .attr("transform", "translate(" + (dim.line_height / 2) + "," +
      ((dim.height - dim.padding.bottom - dim.legend.height) / 2) +
      ")rotate(-90)");


var showDetails = function(that) {
  
  var translate_regex = /translate\(([0-9]*)\..*?,.*?([0-9]*)\./;
  var loc = d3.select(that).attr("transform")
              .match(translate_regex).slice(1, 3);
  var xPos = parseFloat(loc[0]);
  var yPos = parseFloat(loc[1]);
  var datum = that.__data__;

  
  if (xPos > dim.tooltip.horiz_ratio * dim.width) {
    xPos = xPos - dim.tooltip.horiz_bump;
  } else {
    xPos = xPos + dim.tooltip.horiz_bump;
  }
  xPos = xPos - dim.tooltip.width / 2;

  if (yPos > dim.tooltip.vert_ratio * (dim.height - dim.tooltip.height)) {
    yPos = yPos - dim.tooltip.vert_bump;
  } else {
    yPos = yPos + dim.tooltip.vert_bump;
  }
  yPos = yPos + dim.tooltip.height / 2;

  d3.select("#tooltip")
    .style("left", xPos + "px")
    .style("top", yPos + "px");


  d3.select(parm.education.tag).text(datum[parm.education.name]);
  d3.select(parm.mean_age.tag).text(av.roundPretty(datum[parm.mean_age.name], 0));
  d3.select(parm.mean_children.tag)
    .text(datum[parm.mean_children.name].toFixed(1));
  d3.select(parm.mean_work.tag).text(av.roundPretty(datum[parm.mean_work.name], 0));
  d3.select(parm.mean_sleep.tag).text(Math.round((datum[parm.mean_sleep.name]/60) * 100) / 100);
};


var updatePoints = function(data, points, chosen) {

  xScale.domain([0, d3.max(data, function(elem) {
           return elem[chosen.x.name];
         })]);
  yScale.domain([0, d3.max(data, function(elem) {
           return elem[chosen.y.name];
         })]);
  sizeScale.domain([0, d3.max(data, function(elem) {
              return elem[chosen.size.name];
            })]);
  colorScale.domain([0, d3.max(data, function(elem) {
               return elem[chosen.color.name];
             })]);
  strokeScale.domain([0, d3.max(data, function(elem) {
                return elem[chosen.stroke.name];
              })]);

  
  svg.select("#xAxis")
     .transition("updating")
     .duration(dim.transition)
     .call(xAxis);
  svg.select("#xLabel")
     .transition("updating")
     .duration(dim.transition)
     .text(chosen.x.text);

  svg.select("#yAxis")
     .transition("updating")
     .duration(dim.transition)
     .call(yAxis);
  svg.select("#yLabel")
     .transition("updating")
     .duration(dim.transition)
     .text(chosen.y.text);

  
  svg.select("#legend").remove();
  svg.append("g")
     .attr("transform", "translate(0, " +
        (dim.height - dim.padding.bottom + 20) + ")")
     .attr("id", "legend");
  svg.select("#legend")
     .call(legend.scale(colorScale).title(chosen.color.text)
     .formatter(colorScale.tickFormat()));

  points.each(function(elem, idx) {
           
           d3.select(this).select("path").transition("updating")
             .duration(dim.transition).delay(idx * dim.delay)
             .attr("stroke-width", strokeScale(elem[chosen.stroke.name]));
         })
        .transition("updating").duration(dim.transition)
        .delay(function(d, idx) {
           return idx * dim.delay;
         })
         
        .attr('transform', function(elem) {
           return "translate(" +
             (xScale(elem[chosen.x.name]) -
               sizeScale(elem[chosen.size.name])) + "," +
             (yScale(elem[chosen.y.name]) -
               sizeScale(elem[chosen.size.name])) + ") " +
             "scale(" + sizeScale(elem[chosen.size.name]) + ")";
         })
        .style('stroke', function(elem) {
           return colorScale(elem[chosen.color.name]);
         });

  svg.select("#title1")
     .transition("updating")
     .duration(dim.transition)
     .text(chosen.y.text);
  svg.select("#title2")
     .transition("updating")
     .duration(dim.transition)
     .text("by " + chosen.x.text);

};


var ready = function(error, svg_image, raw_data) {
  
  if (error) {
    console.log(error);
  } else {

    var data = od.organizeData(raw_data);

    var points = svg.selectAll('.point')
                    .data(data).enter()
                    .append('g')
                    .classed('point', true)
                    .style('fill', dim.normal.fill)
                    .style('stroke-opacity', dim.normal.opacity)
                    .html(svg_image);
    
    points.append('circle').attr('r', dim.icon_size);

    
    updatePoints(data, points, clicked);

    // Set a listener on all points for when the cursor hovers over them.
    points.on("mouseover", function() {
             // Make all the other points dimmer.
             points.classed("unfocus", true)
                   .transition("focusing").duration(dim.transition)
                   .style('fill', function() {
                      if (d3.select(this).classed("clicked")) {
                        return dim.clicked.fill;
                      } else {
                        return dim.unfocus.fill;
                      }
                    })
                   .style('stroke-opacity', dim.unfocus.opacity);
             // Highlight this point that is being hoevered over. (Notice that
             // we also "moveToFront" the point, so that it is on top.
             d3.select(this).moveToFront()
               .classed("unfocus", false)
               .transition("focusing")
               .duration(dim.transition)
               .style('fill', dim.hover.fill)
               .style('stroke-opacity', dim.hover.opacity);
           })
           // Set a listener for when the cursor no longer hovers over.
          .on("mouseout", function() {
             // Have all points, including the focused point, back to normal.
             points.classed("unfocus", false)
                   .transition("unfocusing").duration(dim.transition)
                   .style('fill', function() {
                      if (d3.select(this).classed("clicked")) {
                        return dim.clicked.fill;
                      } else {
                        return dim.normal.fill;
                      }
                    })
                   .style('stroke-opacity', function() {
                      if (d3.select(this).classed("clicked")) {
                        return dim.clicked.opacity;
                      } else {
                        return dim.normal.opacity;
                      }
                    });
           })
           // Set a listener for a mouse click (or similar "click").
          .on("click", function() {
             var show_details = d3.select("#tooltip").classed("hidden");
             var that = this;
             console.log(that.__data__);
             
             points.each(function() {
                      if (this !== that) {
                        d3.select(this).classed("clicked", false)
                          .transition("clicked").duration(dim.transition)
                          .style('fill', function() {
                             if (d3.select(this).classed("unfocused")) {
                               return dim.unfocus.fill;
                             } else {
                               return dim.normal.fill;
                             }
                           })
                          .style('stroke', function(elem) {
                             return colorScale(elem[clicked.color.name]);
                           });
                      }
                    });
             // What to do on the first click, to highlight the data point.
             if (show_details) {
               // Run "showDetails", which pops up the tooltip with data.
               showDetails(that);
               // Then give point "clicked" attributes (currently orange, etc.)
               // (We're also "moveToFront"-ing again.)
               d3.select(that).moveToFront().classed("clicked", true)
                 .style('stroke', dim.clicked.fill)
                 .style('fill', dim.clicked.fill)
                 .style('stroke-opacity', dim.clicked.opacity);
             // What to do on the second click, to "unhighlight" the point.
             } else {
               // Here we "moveToBack", so that the user can see hidden points
               // merely by clicking and re-clicking.  Then return colors, etc.
               // to old settings, which may be "normal" or "unfocused".
               d3.select(that).moveToBack().classed("clicked", false)
                 .style('stroke', function(elem) {
                    return colorScale(elem[clicked.color.name]);
                  })
                 .style('fill', function() {
                    if (d3.select(this).classed("unfocused")) {
                      return dim.unfocus.fill;
                    } else {
                      return dim.normal.fill;
                    }
                  })
                 .style('stroke-opacity', function() {
                    if (d3.select(this).classed("unfocused")) {
                      return dim.unfocus.opacity;
                    } else {
                      return dim.normal.opacity;
                    }
                  });
             }
             
             d3.select("#tooltip").classed("hidden", !show_details);
           })
          .append("title")
          .text(function(elem) {
            return elem[parm.education.name];
           });

    // Next, we set listeners for all of the buttons at the bottom of the page
    // to allow the user to change data associated with x/y axis, size, color,
    // and outlying ring width.
    // First, the x axis:
    d3.select("div#x_controls").selectAll("button")
      .on("click", function() {
         // Remove any *button* classes & associated styling.
         d3.select("div#x_controls").selectAll("button")
           .classed("clicked", false);
         // Then apply the class / styling for the *clicked* button.
         d3.select(this).classed("clicked", true);
         // Then find the associated information for that clicked button.
         clicked.x = _.find(parm, {'tag': '#' + this.id});
         // Then run the function to update the graph display.
         updatePoints(data, points, clicked);
       });
    
    d3.select("div#y_controls").selectAll("button")
      .on("click", function() {
         d3.select("div#y_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         clicked.y = _.find(parm, {'tag': '#' + this.id});
         updatePoints(data, points, clicked);
       });
    
    d3.select("div#size_controls").selectAll("button")
      .on("click", function() {
         d3.select("div#size_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         clicked.size = _.find(parm, {'tag': '#' + this.id});
         updatePoints(data, points, clicked);
       });
    
    d3.select("div#color_controls").selectAll("button")
      .on("click", function() {
         d3.select("div#color_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         clicked.color = _.find(parm, {'tag': '#' + this.id});
         updatePoints(data, points, clicked);
       });
    
    d3.select("div#stroke_controls").selectAll("button")
      .on("click", function() {
         d3.select("div#stroke_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         clicked.stroke = _.find(parm, {'tag': '#' + this.id});
         updatePoints(data, points, clicked);
       });
  }
};

d3.queue()
  .defer(od.readSvg, "./Telegram.svg")
  .defer(d3.json, "./WA_American-Time-Use-Survey_records.json")
  .await(ready);

