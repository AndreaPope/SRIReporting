
var margin = {top: 50, right: 10, bottom: 2, left: 10},
      width = 1000 - margin.left - margin.right,
      height = 540 - margin.top - margin.bottom,
      color = d3.scaleOrdinal().range(d3.schemeCategory20);


var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);


var svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")")
        ;


d3.json("data/best_hrc_19NOV.json", function(error, data) {
  if (error) throw error;


  var root = d3.hierarchy(data, (d) => d.children)
    .sum((d) => d.size);

  treemap(root);

  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) { return d.data.name; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return color(d.parent.data.name); });



  cell.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.name; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.name; });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.name + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; })
      .style("font-size", 10);

var legend = svg.append("g")
        .attr("class", "legend");
    
    legend.append("text")
        .attr("x", width - margin.right)
        .attr("y", -1 * margin.top/2)
        .attr("text-anchor", "end")
        .style("font-size", 20)
        .text("Top Scoring Companies");

    legend.append("text")
      .attr("x", width - margin.right)
        .attr("y", -5)
        .attr("text-anchor", "end")
        .style("opacity", 0.5)
        .style("font-size", 16)
        .text("Examination by Market Cap & Count");

  d3.selectAll("input")
      .data([sumBySize, sumByCount], function(d) { return d ? d.name : this.value; })
      .on("change", changed);

  var timeout = d3.timeout(function() {
    d3.select("input[value=\"sumByCount\"]")
        .property("checked", true)
        .dispatch("change");
  }, 2000);

  function changed(sum) {
    // timeout.stop();

    treemap(root.sum(sum));

    cell.transition()
        .duration(750)
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
      .select("rect")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; });
  }


}); 

function sumByCount(d) {
  return d.children ? 0 : 1;
}

function sumBySize(d) {
  return d.size;
}




