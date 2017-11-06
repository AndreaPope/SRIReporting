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
      , width = 810 - margin.left - margin.right
      , height = 1500 - margin.top - margin.bottom;

  //Create SVG element
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // Set scales
    var xScale = d3.scaleLinear()
              .domain(d3.extent(dataset, function(d) { if(d.cei_change !== 0 && d.cei_change === d.cei_change) return d.cei_change; }))
              .range([0, width]);

    var yScale = d3.scaleBand()
          .domain(dataset.map(function(d) { if(d.cei_change !== 0 && d.cei_change === d.cei_change) return d.symbol; }))
          .rangeRound([height, 0])
          .padding(0.1);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
        .tickSize(6, 0);
      

    svg.selectAll('.bar')
      .data(dataset)
      .enter().append('rect')
      .attr('class', function (d) {
        return "bar bar--" + (d.cei_change < 0 ? "negative" : "positive");
      })
      .attr('x', function (d) {return xScale(Math.min(0, d.cei_change));})
      .attr('y', function (d) {return yScale(d.symbol);})
      .attr('width', function (d) {return Math.abs(xScale(d.cei_change) - xScale(0));})
      .attr('height', 9);

    svg.append('g').
    attr('class', 'x axis').
    attr('transform', 'translate(0,' + height + ')').
    call(xAxis);

    var tickNegative = svg.append('g').
      attr('class', 'y axis').
      attr('transform', 'translate(' + xScale(0) + ',0)').
      call(yAxis).
      selectAll('.tick').
      filter(function (d, i) {return dataset[i].cei_change < 0;});

      tickNegative.select('line').
      attr('x2', 6);

      tickNegative.select('text').
      attr('x', 9).
      style('text-anchor', 'start');
      };

    function type(d) {
    d.cei_change = +d.cei_change;
    return d;

};

