'use strict';

// Reading json data
d3.json("WA_American-Time-Use-Survey_records.json",
        function(error, data) {
  if (error) {
    console.log(error);
  } else {
  // Selection of required items for tv time of Americans from different education levels
  var tv_data= _.map(data, function(elem) {
      return _.pick(elem, 'Education Level', 'Age Rabge', 'Television');
    });

  // Nesting based on Education Level
  var nested_tv = d3.nest().key(function(elem) {
      return elem['Education Level'];
    })
    .entries(tv_data);


  // calculation mean tv time of each group
  nested_tv.forEach(function(elem) {
      elem.Television = elem.values.reduce(function(frst, scd) {
      return {'Television': frst.Television + scd.Television};
    })
    .Television/100;
  });

   
  // Producing Barplot for mean tv time of different edeucation levels
  var width = 530;
  var height = 330;
  var padding = 30;

  var xScale = d3.scaleLinear().domain([0, 10])
                 .range([padding, width - padding]);
  var yScale = d3.scaleLinear().domain([0, 250])
                 .range([height - padding, padding]);
  var barWidth = Math.floor((width - 2 * padding) / 10);
  var yAxis = d3.axisLeft(yScale);
  var svg = d3.select("div#viz").append("svg")
                                .attr("width", width)
                                .attr("height", height);
  svg.append("text")
     .classed("title", true)
     .attr("x", width / 2)
     .attr("y", padding)
     .text("Average of Sleeping Minutes by Education Level");


  svg.selectAll('rect')
     .data(nested_tv)
     .enter()
     .append('rect')
     .attr('width', barWidth)
     .attr('x', function(elem, idx) {
       return xScale(idx);
     })
     .attr('y', function(elem) {
       return yScale(elem.Television);
     })
     .attr('height', function(elem) {
       return height - yScale(elem.Television);
     });


  svg.append("g").attr("class", "axis")
                 .attr("transform", "translate(" + padding + ",0)")
                 .call(yAxis);

  }
});



