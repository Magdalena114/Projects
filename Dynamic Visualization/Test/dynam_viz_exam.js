// Assign a few global variables... even though we're paring down, this
// is still a good idea!
var parm = {
  'borough': {
    'event_name': 'borough',
    'map_name': 'BoroName',
    'text': 'NYC Borough'
  },
  'data_key': 'num_events',
};

var dim = {
  'margin': {
    'top': 20,
    'right': 0,
    'bottom': 40,
    'left': 60
  },
  'line_height': 25
};
dim.width = 800 - dim.margin.left - dim.margin.right;
dim.height = 800 - dim.margin.top - dim.margin.bottom;

// The shapefile called "The Bronx" simply "Bronx".
var naming_discrepencies = {
  'map': 'Bronx',
  'event': 'The Bronx'
};

// Create our color scale for the choropleth.
var colorScale = d3.scaleQuantize().range(colorbrewer['RdYlBu']['9']);


// This projection below let us zoom into NYC.
var projection = d3.geoAlbers()
    .center([22.2, 40.7])
    .parallels([41.9, 41.8])
    .scale(60000)
    .translate([dim.width / 2, dim.height / 2])
var path = d3.geoPath().projection(projection);

// Create our "paintable" area, with some padding.
var svg = d3.select("body").insert("svg")
            .attr("width", dim.width + dim.margin.left + dim.margin.right)
            .attr("height", dim.height + dim.margin.top + dim.margin.bottom)
            .append("g").classed("viz", true)
            .attr("transform", "translate(" + dim.margin.left + "," +
              dim.margin.top + ")");

// And we set up our plot title.  Note that, by using the variable "svg", we
// are building on from the variable above.
svg.append("text")
   .classed("title", true)
   .attr("x", dim.width / 2)
   .attr("y", dim.line_height)
   .text("Number of Events in NYC, by Borough");



// Now we enter our "main" function.
var ready = function(error, raw_map, raw_data) {
  // Instead of an if / else, we can simply throw an error.
  // Throwing an error halts the function, so no "else" clause needed.
  if (error) {
    throw error;
  }

  // Create a nesting, by borough (the name that the NY Times uses for
  // the borough).
  var data = d3.nest()
               .key(function(elem) {
                  return elem[parm.borough.event_name];
                })
               .entries(raw_data.results);
  
  // Now add our data of interest:  how many events there are.
  data.forEach(function(elem) {
         elem[parm.data_key] = elem.values.length;

         elem['list_of_events']=[];
         for (i=0; i< elem.values.length; i++) {
              elem['list_of_events'].push(elem.values[i]['web_description']);
         }
        });
  
  // Using d3's topojson function, organize our topoJSON file so that it
  // can be used for our work (setting up paths to make the country shapes).
  var map = topojson.feature(raw_map,
                       raw_map.objects.nyc
                     ).features;

  // Now we need to match up the borough names as they are in the NY Times with
  // those as they are in the shapefile.
  // We also hook up the data of interest, the # of events.
  map.forEach(function(elem) {
        elem[parm.borough.text] = elem.properties[parm.borough.map_name];
        if (elem[parm.borough.text] === naming_discrepencies.map) {
          elem[parm.borough.text] = naming_discrepencies.event;
        }
        var num_events = data.find(function(d) {
                                     return d.key === elem[parm.borough.text];
                                   });
                         
        if (num_events === undefined) {
          elem[parm.data_key] = 0;
        } else {
          elem[parm.data_key] = num_events[parm.data_key];
          elem['list_of_events'] = num_events['list_of_events']
        }
      });

  // Create the domain side of our color scale.
  colorScale.domain([0, d3.max(map, function(elem) {
               return elem[parm.data_key];
             })]);

  // Now we create the DOM elements with all of the neighborhoods on the map.
  var boroughs = svg.selectAll(".borough").data(map)
                 .enter().append("g")
                 .classed("borough", true);

  // Here we color the areas, depending upon their number of NY Times events.
  boroughs.style('fill', function(elem) {
             return colorScale(elem[parm.data_key]);
           })
          .append("path").attr("d", path).append("title")
          // And we add easy "hover over" information to drill into data details.
          .text(function(elem) {
             return elem[parm.borough.text] + ':  ' +
               Math.round(elem[parm.data_key]);
           });
  boroughs.on("click", function(elem) {
    console.log(elem.list_of_events);

    var test=document.createElement('section');
        test.setAttribute('id','test');

    var ul=document.createElement('ul');


     document.body.appendChild(test);
     test.appendChild(ul);

     for (var i=0; i<elem.list_of_events.length; i++){

     var li=document.createElement('li');

     ul.appendChild(li);
     li.innerHTML=li.innerHTML + elem.list_of_events[i];

    }


  });
};

// And, of course, here we run the function that gets the topoJSON and the NY
// Times data, using our "main" function of "ready" as the callback function.
d3.queue()
  .defer(d3.json, "./data/nyc.topojson")
  .defer(d3.json, "./data/nytimes_event_listings.json")
  .await(ready);


