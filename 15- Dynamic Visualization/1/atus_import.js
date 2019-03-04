d3.json("WA_American-Time-Use-Survey_records.json", function(error, data) {
  if (error) {
    console.log(error);
  } else {
    var nested_data = d3.nest().key(function(elem) {
      return elem['Education Level'];
    })
    .entries(data);
    console.log(nested_data);
  }
});

