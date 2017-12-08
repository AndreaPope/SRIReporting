var dataset;

var rowConverter = function(d) {
  return {
    symbol: d.Symbol,
    name: d.Name,
    lastsale: parseFloat(d.LastSale),
    marketcap: d.MarketCap,
    sector: d.Sector,
    industry: d.industry,
    cei_change: parseFloat(d.Diff),
    reco: d.Reco
  };
}

// Load data
d3.csv("data/SRI-R-HRC.csv", rowConverter, function(error, data) {
  if (error) {console.log(error);}
  else {
    var dataset = data;
    console.log("Data loaded. Data:");
    console.table(dataset, ["symbol", "name", "lastsale", "marketcap", "sector", "industry", 
        "cei_change", "reco"]);
    dataset.sort(function(a, b) {
      return a.cei_change - b.cei_change;
    });

    // Call functions here //
    barGraph(data);
// End else statement
  }

});



var barGraph = function(dataset) {

  //Set margin
    var margin = {top: 50, right: 20, bottom: 50, left: 20}
      , width = 1000 - margin.left - margin.right
      , height = 525 - margin.top - margin.bottom;

  //Create SVG element
    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")")
        ;

    // Set scales
    var yScale = d3.scaleLinear()
          // .domain(d3.extent(dataset, function(d) { if(d.cei_change !== 0 && d.cei_change === d.cei_change) return d.cei_change; }))
          .domain(d3.extent(dataset, function(d) { return d.cei_change; }))
          .range([height, 0]);

    var xScale = d3.scaleBand()
          .domain(dataset.map(function(d) { return d.symbol; }))
          .rangeRound([0, width])
          .padding(0.1);


    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
        .tickSize(6, 0);

    // Create color scheme
    var color = d3.scaleSequential(d3.interpolateRdBu);
    var max = d3.max(dataset, function(d) { return d.cei_change; });
      color.domain([-max, max]);
      

svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        // .attr("class", function(d) {

            // if (d.cei_change < 0){
            //     return "bar--negative";
            // } else {
            //     return "bar--positive";
            // }

        // })
        .attr("data-yr", function(d){
            return d.symbol;
        })
        .attr("data-c", function(d){
            return d.cei_change;
        })
        .attr("y", function(d) {

            if (d.cei_change > 0){
                return yScale(d.cei_change);
            } else {
                return yScale(0);
            }

        })
        .attr("x", function(d) {
            return xScale(d.symbol);
        })
        .attr("width", 6)
        .attr("height", function(d) {
            return Math.abs(yScale(d.cei_change) - yScale(0));
        })

        // New
        .style("fill", function(d) {
            return color(d.cei_change)
        })

        .on("mouseover", function(d){
            d3.select("#_co")
                .text("Company: " + d.symbol);
            d3.select("#financial")
                .text("Recommendation: " + d.reco)
        });

    // Add legend
    var legend = svg.append("g")
        .attr("class", "legend");
    
    legend.append("text")
        .attr("x", width - margin.right)
        .attr("y", -1 * margin.top/2)
        .attr("text-anchor", "end")
        .style("font-size", 20)
        .text("Publicly Traded Companies");
    
    legend.append("text")
      .attr("x", width - margin.right)
        .attr("y", -5)
        .attr("text-anchor", "end")
        .style("opacity", 0.5)
        .style("font-size", 16)
        .text("Change in HRC Corporate Equality Index (2016-2017)*");
    // End legend

    // Add caveat
    var caveat = svg.append("g")
        .attr("class", "caveat")

    caveat.append("text")
        .attr("x", width - margin.right)
        .attr("y", height)
        .attr("text-anchor", "end")
        .style("opacity", 0.5)
        .style("font-size", 12)
        .text("*(Only companies with a year over year change are displayed)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .text("HRC Score Change")
        .attr("transform", "translate(25, 150), rotate(-90)")


// Runs line to anchor bars
    svg.append("g")
        .attr("class", "x axis")
        .append("line")
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("x2", width);

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(50, 5)")
        .append("text")
        .attr("id", "_co");

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(175, 5)")
        .append("text")
        .attr("id","financial");

};


function type(d) {
    d.cei_change = +d.cei_change;
    return d;

};

