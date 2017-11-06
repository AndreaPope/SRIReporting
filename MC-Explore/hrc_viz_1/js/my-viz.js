var dataset;

var rowConverter = function(d) {
  return {
    symbol: d.Symbol,
    name: d.Name,
    lastsale: parseFloat(d.LastSale),
    // marketcap: parseFloat(d.MarketCap),
    sector: d.Sector,
    industry: d.industry,
    cei_17: parseFloat(d.CEI_Score_2017),
    cei_16: parseFloat(d.CEI_Score_2016),
    cei_change: parseFloat(d.CEI_Score_2017) - parseFloat(d.CEI_Score_2016),
    fort_rank: parseFloat(d.Fortune_1000_Rank)
  };
}

// Load data
d3.csv("data/SRI-R-HRC.csv", rowConverter, function(error, data) {
  if (error) {console.log(error);}
  else {
    var dataset = data;
    console.log("Data loaded. Data:");
    console.table(dataset, ["symbol", "name", "lastsale", "sector", "industry", 
        "cei_17", "cei_16", "cei_change", "fort_rank"]);

    // Call functions here //
    barGraph(data);
// End else statement
  }

});


var barGraph = function(dataset) {

    var margin = {top: 25, right: 120, bottom: 100, left: 80}
      , width = 810 - margin.left - margin.right
      , height = 350 - margin.top - margin.bottom;

    // Set scales
    var xScale = d3.scaleBand()
          .domain(dataset.map(function(d) { if(d.cei_change != 0 && d.cei_change === d.cei_change) return d.symbol; }))
          .range([0, width])
          .padding(0.1);
      
    var yScale = d3.scaleLinear()
              .domain([0, d3.max(dataset, function(d) { return d.cei_change; })])
              .range([height, 0]);


  //Create SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
      .data(dataset)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.symbol); })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.cei_change); })
      .attr("height", function(d) { return height - yScale(d.cei_change); });

    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(yScale));

};

