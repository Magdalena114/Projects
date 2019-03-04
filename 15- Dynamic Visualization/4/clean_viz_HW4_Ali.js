//'use strict';

var performBarplot = function(locale_data, nested_crime) {
  var width = 800;
  var height = 500;
  var padding = 30;

  var xScale = d3.scaleLinear().domain([0, 78])
                 .range([padding, width - padding]);
  var yScale = d3.scaleLinear().domain([0, 10])
                 .range([height - padding, padding]);
  var barWidth = Math.floor((width - 2 * padding) / 78);
  var yAxis = d3.axisLeft(yScale);
  var svg = d3.select("div#viz").append("svg")
                                .attr("width", width)
                                .attr("height", height);
  svg.append("text")
     .classed("title", true)
     .attr("x", width / 2)
     .attr("y", padding)
     .text("Number of Arrests (Out of 10)");
  svg.append("text")
     .classed("title", true)
     .attr("x", width / 2)
     .attr("y", 2 * padding)
     .text("by Neighborhood");

     svg.selectAll('rect')
     .data(nested_crime)
     .enter()
     .append('rect')
     .attr('width', barWidth)
     .attr('x', function(elem, idx) {
       return xScale(idx);
     })
     .attr('y', function(elem) {
       return yScale(elem.Arrests);
     })
     .attr('height', function(elem) {
       return height - yScale(elem.Arrests);
     })
     .on("mouseover", function() {
       d3.select(this)
         .style("stroke-dasharray", ("10, 2"))
         .style('fill', 'blue') 
     })
     .on("mouseout", function() {
       d3.select(this)
         .style('fill', 'green')
     });

  svg.append("g").attr("class", "axis")
                 .attr("transform", "translate(" + padding + ",0)")
                 .call(yAxis);

  d3.select("div#controls").selectAll("button")
    .on("click", function() {
      svg.selectAll('rect')
         .transition("resetting")
         .duration(3000)
         .style('fill', 'orange')
         .style("stroke-dasharray", ("0, 0"));
      
    });
};

var orgData = function(incoming_data) {
  // Be sure to add some JSDoc comments!!!
  var crime_data = _.map(incoming_data, function(elem) {
        return _.pick(elem, 'CA Name', 'Primary Type', 'Arrest');
      });
  var locale_data = _.map(incoming_data, function(elem) {
        return _.pick(elem, 'CA Name', 'Area Per Capita Income',
          'Area Prop Age>16 Unemployed', 'Area Prop Households Below Poverty',
          'Hardship Index');
      });
  var nested_crime = d3.nest().key(function(elem) {
        return elem['CA Name'];
      })
      .entries(crime_data);
  nested_crime.forEach(function(elem) {
      elem.Arrests = elem.values.reduce(function(frst, scd) {
        return {'Arrest': frst.Arrest + scd.Arrest};
      })
      .Arrest;
    });
  locale_data = _.uniqBy(locale_data, function (elem) {
      return elem['CA Name'];
    });

  return {
    'locale_data': locale_data,
    'nested_crime': nested_crime
  };
};

/** The equivalent to 'main', the main code launch for our program. */
d3.json("../data/mini_Chicago_crime_records.json",
        function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var data_dict = orgData(data);
    performBarplot(data_dict.locale_data, data_dict.nested_crime);
  }
});
