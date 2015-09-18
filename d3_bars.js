/* global d3 */
function getChart(data) { // eslint-disable-line no-unused-vars
  // SET UP DIMENSIONS
  var w = 700,
      h = 300;

  // margin.middle is distance from center line to each y-axis
  var margin = {
    top: 20,
    right: 20,
    bottom: 24,
    left: 20,
    middle: 40
  };

  // the width of each side of the chart
  var regionWidth = w / 2 - margin.middle;

  // these are the x-coordinates of the y-axes
  var pointA = regionWidth,
      pointB = w - regionWidth;


  // CREATE SVG
  var svg = d3.select('body').append('svg')
    .attr('width', margin.left + w + margin.right)
    .attr('height', margin.top + h + margin.bottom)
    // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
    .append('g')
      .attr('transform', translation(margin.left, margin.top));

  // labels
  var labels = svg.selectAll('text')
    .data(data)
    .enter()
    .append('text');

  // find the maximum data value on either side
  //  since this will be shared by both of the x-axes
  var maxValue = Math.max(
    d3.max(data, function(d) { return d.q14; }),
    d3.max(data, function(d) { return d.q21; })
  );

  // SET UP SCALES

  // the xScale goes from 0 to the width of a region
  //  it will be reversed for the left x-axis
  var xScale = d3.scale.linear()
    .domain([0, maxValue])
    .range([0, regionWidth])
    .nice();

  var yScale = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.group; }))
    .rangeRoundBands([h, 0], 0.1);


  // SET UP AXES
  var yAxisLeft = d3.svg.axis()
    .scale(yScale)
    .orient('right')
    .tickSize(4, 0)
    .tickPadding(margin.middle - 4);

  var yAxisRight = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickSize(4, 0)
    .tickFormat('');

  var xAxisRight = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var xAxisLeft = d3.svg.axis()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
    .scale(xScale.copy().range([pointA, 0]))
    .orient('bottom');

  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  var leftBarGroup = svg.append('g')
    .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
  var rightBarGroup = svg.append('g')
    .attr('transform', translation(pointB, 0));

  // DRAW AXES
  svg.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle')
    .style('shape-rendering', 'crispEdges');

  svg.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight)
    .style('shape-rendering', 'crispEdges');

  svg.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h))
    .call(xAxisLeft)
    .style('shape-rendering', 'crispEdges');

  svg.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, h))
    .call(xAxisRight)
    .style('shape-rendering', 'crispEdges');

  // DRAW BARS
  leftBarGroup.selectAll('.bar.left')
    .data(data)
    .enter().append('rect')
      .attr('class', 'bar left')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(d.q14); })
      .attr('height', '30px')
      .attr('fill', '#92b5d8');

  rightBarGroup.selectAll('.bar.right')
    .data(data)
    .enter().append('rect')
      .attr('class', 'bar right')
      .attr('x', 0)
      .attr('y', function(d) { return yScale(d.group); })
      .attr('width', function(d) { return xScale(d.q21); })
      .attr('height', '30px')
      .attr('fill', '#161f34');

  // bar labels
  svg.append('g')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
      .text(function(d) { return d.q14; })
        .attr('x', function(d) { return (w / 2) - xScale(d.q14) - margin.middle - 15; })
        .attr('y', function(d) { return yScale(d.group) + 20; });

  svg.append('g')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
      .text(function(d) { return d.q21; })
        .attr('x', function(d) { return (w / 2) + margin.middle + xScale(d.q21) + 15; })
        .attr('y', function(d) { return yScale(d.group) + 20; });

  // so sick of string concatenation for translations
  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }

  return document.getElementsByTagName('svg')[0];
}
