var dataset;

var rowConverter = function(d) {
  return {
    symbol: d.Symbol,
    name: d.Name,
    lastsale: parseFloat(d.LastSale),
    marketcap: d.MarketCap,
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
    console.table(dataset, ["symbol", "name", "lastsale", "marketcap", "sector", "industry", 
        "cei_17", "cei_16", "cei_change", "fort_rank"]);
    dataset.sort(function(a, b) {
      return a.cei_change - b.cei_change
    });

    // Call functions here //
    barGraph(data);
// End else statement
  }

});



var barGraph = function(dataset) {

  //Set margin
    var margin = {top: 25, right: 120, bottom: 100, left: 80}
      , width = 1250 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;

  //Create SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Set scales
    var yScale = d3.scaleLinear()
          .domain(d3.extent(dataset, function(d) { if(d.cei_change !== 0 && d.cei_change === d.cei_change) return d.cei_change; }))
          .range([height, 0]);

    var xScale = d3.scaleBand()
          .domain(dataset.map(function(d) { if(d.cei_change !== 0 && d.cei_change === d.cei_change) return d.symbol; }))
          .rangeRound([0, width])
          .padding(0.1);


    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
        .tickSize(6, 0);

    // New data
    // var z = d3.scaleSequential(d3.interpolateViridis);
    // z.domain([0, d3.max(dataset, function(d) {
    //     return d.cei_change;
    // })]);
      

svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", function(d) {

            if (d.cei_change < 0){
                return "bar--negative";
            } else {
                return "bar--positive";
            }

        })
        .attr("data-yr", function(d){
            return d.symbol;
        })
        .attr("data-c", function(d){
            return d.cei_change;
        })
        .attr("title", function(d){
            return (d.symbol + ": " + d.cei_change + " °C")
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

        // New data
        // .style("fill", function(d) {
        //         return z(d.cei_change);
        //     })
        // end new

        .on("mouseover", function(d){
            // alert("Year: " + d.Year + ": " + d.Celsius + " Celsius");
            d3.select("#_yr")
                .text("Company: " + d.symbol);
            d3.select("#degree")
                // .text(d.cei_change + " points");
                .text(d.marketcap)
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .text("Score Change")
        .attr("transform", "translate(15, 70), rotate(-90)")

    // svg.append("g")
    //     .attr("class", "X axis")
    //     .attr('transform', 'translate(0,' + height + ')')
    //     .call(xAxis);

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
        .attr("id", "_yr");

    svg.append("g")
        .attr("class", "infowin")
        .attr("transform", "translate(175, 5)")
        .append("text")
        .attr("id","degree");

};


function type(d) {
    d.cei_change = +d.cei_change;
    return d;

};

