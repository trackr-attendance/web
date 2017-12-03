function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis)

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Avg Engagement Score');
}

function drawPaths (svg, data, x, y) {
  var medianLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) {return x(d.time)})
    .y(function (d) {return y(d.score)});

  svg.datum(data);

  svg.append('path')
    .attr('class', 'median-line')
    .attr('d', medianLine)
    .attr('clip-path', 'url(#rect-clip)');
}

function makeChart (data) {
  var svgWidth  = 800,
      svgHeight = 500,
      margin = { top: 20, right: 20, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.scale.linear().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.time; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.score; })]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('#engagement-chart').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
  drawPaths(svg, data, x, y);
  rectClip.transition()
    .duration(4000)
    .attr('width', chartWidth);
}

$(document).ready(function(){
  d3.json($("#engagementDataset").val(), function (error, rawData) {
    if (error) {
      console.error(error);
      return;
    }
    makeChart(rawData);
  });
});