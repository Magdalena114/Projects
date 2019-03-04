//'use strict';

d3.json("../data/mini_Chicago_crime_records.json", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var crime_data = _.map(data, function(elem) {
          return _.pick(elem, 'CA Name', 'Primary Type', 'Arrest');
        });
    var locale_data = _.map(data, function(elem) {
          return _.pick(elem, 'CA Name', 'Area Per Capita Income',
          'Area Prop Age>16 Unemployed', 'Area Prop Households Below Poverty',
          'Hardship Index');
        });
    nested_crime = d3.nest().key(function(elem) {
          return elem['CA Name'];
        })
        .entries(crime_data);
    locale_data = _.uniqBy(locale_data, function (elem) {
      return elem['CA Name'];
    });

    d3.select("svg").selectAll('rect')
      .data(nested_crime).enter()
      .append('rect')
      .attr('width', 10)
      .attr('x', function(d, i) { return (i * 10); })
      .attr('height', function(v) {
        return (10 * d3.sum(v.values, function(d) {
          return d.Arrest;
        })); })
      
// Changing style by defined class in CSS
    d3.select("svg").append("text")
      .classed("title", true)
      .attr("x", 250)
      .attr("y", 250)
      .text("Number of Arrests");

// Changing style by defined ID in CSS

    d3.select("svg").append("text")
      .attr('id','description')
      .attr("x", 200)
      .attr("y", 240)
      .text("With Silly yellow Bars and No Legend!");

// Changing style by direct usage of .attr function 

    d3.select('svg').selectAll('rect')
    .attr('fill', 'yellow');

// Changing style by direct usage of .style function 

    d3.select("svg").selectAll('text')
    .style("writing-mode", "tb")

  }
});
