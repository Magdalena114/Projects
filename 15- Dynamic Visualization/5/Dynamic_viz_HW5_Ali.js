//'use strict';

var parm = {
  education: {
    tag: "#education", name: "Education Level", text: "Education Level",
    sort_tag: "#education_sort", ascending: true
  },
  mean_age: {
    tag: "#mean_age", name: "Average Age", text: "Average Age",
    sort_tag: "#mean_age_sort", display_tag: "#mean_age_display", ascending: true
  },
  mean_children: {
    tag: "#mean_children", name: "Average number of children",
    text: "Average number of children", sort_tag: "#mean_children_sort",
    display_tag: "#mean_children_display", ascending: true
  },
  mean_work: {
    tag: "#mean_work", name: "Average weekly worked hours",
    text: "Average weekly worked hours", sort_tag: "#mean_work_sort",
    display_tag: "#mean_work_display", ascending: true
  },
  mean_sleep: {
    tag: "#mean_sleep", name: "Average daily sleeping minutes",
    text: "Average daily sleeping minutes", sort_tag: "#mean_sleep_sort",
    display_tag: "#mean_sleep_display", ascending: true
  },
  mean_housework: {
    tag: "#mean_housework", name: "Average daily housework minutes", text: "Average daily housework minutes",
    sort_tag: "#mean_housework_sort", display_tag: "#mean_housework_display", ascending: true
  },
  mean_childcare: {
    tag: "#mean_childcare", name: "Average daily childcare minutes", text: "Average daily childcare minutes",
    sort_tag: "#mean_childcare_sort", display_tag: "#mean_childcare_display", ascending: true
  },
  mean_shopping: {
    tag: "#mean_shopping", name: "Average daily shopping minutes", text: "Average daily shopping minutes",
    sort_tag: "#mean_shopping_sort", display_tag: "#mean_shopping_display", ascending: true
  },
  mean_tv: {
    tag: "#mean_tv", name: "Average daily TV minutes", text: "Average daily TV minutes",
    sort_tag: "#mean_tv_sort", display_tag: "#mean_tv_display", ascending: true
  }
}

var dim = {
  margin: { top: 40, right: 0, bottom: 0, left: 60 },
  padding: { top: 40, bottom: 20 },
  tooltip: {width: 100, horiz_ratio: 0.4, vert_ratio: 0.6},
  line_height: 30,
  expansion: 1.4,
  transition: 600,
  delay: 20,
};
dim.width = 800 - dim.margin.left - dim.margin.right;
dim.height = 500 - dim.margin.top - dim.margin.bottom;
dim.tooltip.horiz_bump = 0.2 * dim.width;
dim.tooltip.vert_top = 0.35 * dim.height;
dim.tooltip.vert_bottom = 0.95 * dim.height;

var xScale = d3.scaleBand()
               .range([0, dim.width])
               .padding(.1);
var yScale = d3.scaleLinear()
               .range([dim.height - dim.padding.bottom, dim.padding.top]);

var yAxis = d3.axisLeft(yScale);

var svg = d3.select("div#viz").append("svg")
            .attr("width", dim.width + dim.margin.left + dim.margin.right)
            .attr("height", dim.height + dim.margin.top + dim.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + dim.margin.left + ","
              + dim.margin.top + ")");

var showDetails = function(that) {
  var xPos = parseFloat(d3.select(that).attr("x"));
  var yPos = parseFloat(d3.select(that).attr("y"));
  var datum = that.__data__
  tempo=datum;
  if (xPos > dim.tooltip.horiz_ratio * dim.width) {
    xPos = xPos - dim.tooltip.horiz_bump;
  } else {
    xPos = xPos + dim.tooltip.horiz_bump;
  }
  xPos = xPos - dim.tooltip.width / 2;

  if (yPos > dim.tooltip.vert_ratio * dim.height) {
    yPos = dim.tooltip.vert_top;
  } else {
    yPos = dim.tooltip.vert_bottom;
  }
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

var sortBars = function(data, bars, sort_dim) {
  sort_dim.ascending = !sort_dim.ascending
  data.sortBy(sort_dim.name, sort_dim.ascending);
  var xScaleUpdate = xScale.domain(data.map(function(elem) {
        return elem[parm.education.name];
      })).copy();

  bars.sort(function(a, b) {
         return xScaleUpdate(a[parm.education.name])
              - xScaleUpdate(b[parm.education.name]);
       });

  var transition = bars.transition("sorting").duration(dim.transition);
  var delay = function(d, idx) { return idx * dim.delay; };
  transition.delay(delay)
            .attr("x", function(elem) {
               return xScaleUpdate(elem[parm.education.name]);
             }); 
};

var updateBars = function(data, bars, y_dim) {
  yScale.domain([0, d3.max(data, function(elem) {
           return elem[y_dim.name];
         })]);

  svg.select(".axis")
      .transition("updating")
      .duration(dim.transition)
      .call(yAxis)
      

  bars.transition("updating")
      .duration(dim.transition)
      .delay(function(d, idx) { return idx * dim.delay; })
      .attr('y', function(elem) {
         return yScale(elem[y_dim.name]);
       })
      .attr('height', function(elem) {
         return dim.height - yScale(elem[y_dim.name]);
       })
      .text(function(elem) {
         return y_dim.text + ": " + elem[y_dim.name];
       });

  svg.select(".title_dim")
     .text(y_dim.text)
     .transition("updating")
     .duration(dim.transition);
};


d3.json("WA_American-Time-Use-Survey_records.json",
        function(error, raw_data) {
  if (error) {
    console.log(error);
  } else {
    // Capture Data
    var data = od.organizeData(raw_data);
    

   xScale.domain(data.map(function(elem) {
      return elem[parm.education.name];
    }));  

    svg.append("g").attr("class", "axis");
    svg.append("text")
       .classed("title", true)
       .classed("title_dim", true)
       .attr("x", dim.width / 2)
       .attr("y", 0);
    var bars = svg.selectAll('rect').data(data)
                  .enter().append('rect')
                  .attr('width', xScale.bandwidth())
                  .attr('x', function(elem) {
                     return xScale(elem[parm.education.name]);
                   });

    
    updateBars(data, bars, parm.mean_age);

    bars.on("mouseover", function(elem) {
           d3.select(this)
             .moveToFront()
             .transition("focusing")
             .duration(dim.transition)
             .attr("width", xScale.bandwidth() * dim.expansion)
             .attr("x", xScale(elem[parm.education.name])
                - xScale.bandwidth() * (dim.expansion - 1) / 2)
            })
        .on("mouseout", function(elem) {
              d3.select(this)
                .transition("unfocusing")
                .duration(dim.transition)
                .attr("width", xScale.bandwidth())
                .attr('x', function(elem) {
                   return xScale(elem[parm.education.name]);
                 });
            })
        .on("click", function() {
           // Since we want to toggle to the opposite, "show_details"
           // is set to the current hidden level.
           var show_details = d3.select("#tooltip").classed("hidden");
           var that = this;
           console.log(that.__data__);
           bars.classed("clicked", false);
           if (show_details) {
             showDetails(that);
             d3.select(that).classed("clicked", true);
           }
           d3.select("#tooltip").classed("hidden", !show_details);
         })
          .append("title")
          .text(function(elem) {
            return elem[parm.education.name];
          });
          

    svg.append("text")
       .classed("title", true)
       .attr("x", dim.width / 2)
       .attr("y", dim.line_height)
       .text("by Education Level");

    d3.select("div#sort_controls").selectAll("button")
       .on("click", function() {
         d3.select("div#sort_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         var clicked_dim = _.find(parm, {'sort_tag': '#' + this.id});
         sortBars(data, bars, clicked_dim);
        });

    d3.select("div#display_controls").selectAll("button")
       .on("click", function() {
         d3.select("div#display_controls").selectAll("button")
           .classed("clicked", false);
         d3.select(this).classed("clicked", true);
         var clicked_dim = _.find(parm, {'display_tag': '#' + this.id});
         updateBars(data, bars, clicked_dim);
       });
  }
});
