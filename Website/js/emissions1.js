var my_viz_lib = my_viz_lib || {};

  //create SVG Element
var svg = d3.select("#emissions1").append("svg")
  .attr("width", "960")
  .attr("height", "500");


margin = {top: 20, right: 20, bottom: 60, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;


my_viz_lib.makeStacked = function() {
  w = 960;
  h = 500;

  //scaling
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .align(0.1);

  var x_alt = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0)
    .align(0);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
    .range(["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"]);


  var data = [];
  var data_ = function(_) {
    var that = this;
    if (!arguments.length) return data;
      data = _;
    return that;
  }  //end makeStacked Data


    var rect = d3.select("svg");

    var plot_ = function() {

      var keys = data.columns.slice(1,6);
      //console.log(keys);
      
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //set domain for scales
      x.domain(data.map(function(d) { return d.sector; }));
      x_alt.domain(data.map(function(d) { return d.sector; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
      z.domain(keys);


      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) { 
        //console.log(d[1]);
           records  = d[1] - d[0];
           return "Number of Records: <span style='color:red'>" + records + "</span>";
        })

        svg.call(tip);
    //build transparent rect behind stacked charts (used for higlighting later)
        g.selectAll(".bar")
        .data(data)

      rect = g
      .selectAll("rect")
      .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", width)
          .attr("y", height)
          .attr("height", 0)
          .attr("fill", "white");


     rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.total) + 2; })
        .attr("height", function(d) { return (height - y(d.total)) + 4;})
      .transition()
        .attr("x", function(d) { return x_alt(d.sector); })
        .attr("width", x.bandwidth() + 2);


      //build stacked bar charts
      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data)) //binding data
        .enter().append("g")
          .attr("fill", function(d) { return z(d.key); })  //match fill color
          .selectAll("rect")
          .data(function(d) {return d;  })
          .enter().append("rect")
          .on("mouseover", tip.show)
          .transition()
            .duration(500)
            .delay(function(d, i) { return i * 10; })
            .attr("x", function(d) {return x(d.data.Sector); })  
            .attr("y", function(d) {return y(d[1]); })
            .attr("class", "bar")
            .attr("height", function(d) {return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());
            
      
      //add axis   
      g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
          return "rotate(-50)" 
        });

      g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start");
                  
      g.append("g")
        .append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("x", -20)
        .attr("y", -15)
        .attr("dy", "0.32em")
        .text("# of Companies");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    // .data(keys.slice().reverse())
    .data(keys.slice())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("y", 10)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 20)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });


    g.append("g")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", 0)
      .attr("dy", "0.32em")
      .text("Performance Band");

    } //end makeStacked plot

    var highlight = function(id) {
      //console.log("in highlight");
      rect.filter(function(d,i) { return (i === id) ? true : false; }).attr("fill", "#323c4c").style("stroke-width", "20px" );
    }
  
    var unhighlight = function(id) {
      //console.log("in unhighlight");
      rect.filter(function(d,i) { return (i === id) ? true : false; }).attr("fill", "white").style("stroke-width", "0px");
    }

    var public = {
      "plot": plot_,
      "data": data_,
      "highlight": highlight,
      "unhighlight": unhighlight
    };
  
    return public;

} //end makeStacked function

my_viz_lib.makeGrouped = function() {
  w = 960;
  h = 500;

  var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  var x1 = d3.scaleBand()
    .padding(0.05);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
    .range(["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"]);

  var data = [];
  var data_ = function(_) {
    var that = this;
    if (!arguments.length) return data;
      data = _;
    return that;
  }  //end makeGrouped Data

  var rect = d3.select("svg");

  var plot_ = function() {

    var keys = data.columns.slice(1,6);
    console.log(keys);
  
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x0.domain(data.map(function(d) { return d.sector; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();


    rect = g
      .selectAll("rect")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.sector) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", height)
        .attr("width", x1.bandwidth())
    
    rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });
    
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      //.attr("transform", function(d) {return "rotate(-50)"})
      .call(d3.axisBottom(x0));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    // .append("text")
    //   .attr("x", 2)
    //   .attr("y", y(y.ticks().pop()) + 0.5)
    //   .attr("dy", "0.32em")
    //   .attr("fill", "#000")
    //   .attr("font-weight", "bold")
    //   .attr("text-anchor", "start")
    //   .text("# of Companies");

    g.append("g")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .attr("x", -20)
      .attr("y", -15)
      .attr("dy", "0.32em")
      .text("# of Companies");

    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    // .data(keys.slice().reverse())
    .data(keys.slice())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("y", 10)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 20)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });


    g.append("g")
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", 0)
      .attr("dy", "0.32em")
      .text("Performance Band");

  }

  var public = {
    "plot": plot_,
    "data": data_
  };
  
  return public;

} //end makeGrouped function



d3.csv("data/SRI-R-Co2e-CT.csv", function(d) {
  d.A = +d.A;
  d.B = +d.B;
  d.C = +d.C;
  d.D = +d.D;
  d.E = +d.E;
  d.total = +d.A + +d.B + +d.C + +d.D + +d.E;
  d.sector = d.Sector;
  //console.log(d.Sector);

    
  return d;
}, function(error, data) {
  if (error) throw error;

  makeStacked1 = my_viz_lib.makeStacked();
  makeStacked1.data(data);
  makeStacked1.plot();


  // makeGrouped1 = my_viz_lib.makeGrouped();
  // makeGrouped1.data(data);
  //makeGrouped1.plot();

}); //end initial data pull


d3.selectAll("input")
    .on("change", changed);


function changed() {
  //console.log("here");
  chart_type = this.value;

  d3.csv("data/SRI-R-Co2e-CT.csv", function(d) {
  d.A = +d.A;
  d.B = +d.B;
  d.C = +d.C;
  d.D = +d.D;
  d.E = +d.E;
  d.total = +d.A + +d.B + +d.C + +d.D + +d.E;
  d.sector = d.Sector;

    
  return d;
  }, function(error, data) {
    if (error) throw error;
    if (chart_type == "grouped") {
      console.log ("make Grouped");

      d3.selectAll("svg > *").remove();
      makeGrouped1 = my_viz_lib.makeGrouped();
      makeGrouped1.data(data);
      makeGrouped1.plot();
    }
    else {
      console.log ("make stacked");
      d3.selectAll("svg > *").remove();
      makeStacked1 = my_viz_lib.makeStacked();
      makeStacked1.data(data);
      makeStacked1.plot();
    }

  }); //data pull

} //end changed
