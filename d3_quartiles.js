/* global d3 */
/* eslint-disable no-multi-spaces */
function getChart() { // eslint-disable-line no-unused-vars
  var data = [
    { x: 0,   y: 0 },
    { x: 150,  y: 0 },
    { x: 300, y: 0 },
    { x: 450, y: 0 },
    { x: 0,   y: 80 },
    { x: 150,  y: 80 },
    { x: 300, y: 80 },
    { x: 450, y: 80 },
    { x: 0,   y: 160 },
    { x: 150,  y: 160 },
    { x: 300, y: 160 },
    { x: 450, y: 160 }
  ];

  var labelData = [
    'Agenda Setting Influence',
    'Helpfulness in Implementation',
    'Usefulness of Advice'
  ];

  var w = 800,
      h = 300;

  var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h);

  var bars = svg.append('g')
    .attr('transform', translation(120, 100));

  bars.selectAll('.bars')
    .data(data)
    .enter()
    .append('rect')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .attr('width', 120)
      .attr('height', 30)
      .attr('fill', '#000')
      .attr('fill', function(d) {
        switch (d.x) {
          case 0:
            return '#92b5d8';
          case 150:
            return '#76b657';
          case 300:
            return '#FFDD75';
          case 450:
            return '#E31E1E';
        }
      });

  var labels = svg.append('g')
    .attr('transform', translation(0, 110));

  labels.selectAll('.label')
    .data(labelData)
    .enter()
    .append('text')
      .text(function(d) { return d; })
      .attr('x', 0)
      .attr('y', function(d, i) { return i * 80; })
      .call(wrap, 100);

  svg.append('g').attr('transform', translation(120, 80))
    .selectAll('.description')
    .data(['Best Performing', 'Median', 'Worst Performing'])
    .enter()
    .append('text')
      .text(function(d) { return d; })
      .attr('y', 0)
      .attr('x', function(d, i) {
        switch (i) {
          case 0:
            return 0;
          case 1:
            return 285;
          case 2:
            return 450;
        }
      })
      .attr('text-anchor', function(d, i) {
        switch (i) {
          case 0:
            return 'left';
          case 1:
            return 'middle';
          case 2:
            return 'right';
        }
      });

  // median markers
  svg.append('g').selectAll('.marker')
    .data([0, 1, 2])
    .enter()
    .append('rect')
      .attr('x', 400)
      .attr('y', function(d) { return 90 + d * 80; })
      .attr('width', 10)
      .attr('height', 50)
      .attr('fill', '#000');

  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }

  // shout out to @mbostock, luh u boo
  // http://bl.ocks.org/mbostock/7555321
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this), // eslint-disable-line no-shadow
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = 0,//parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    });
  }
  return document.getElementsByTagName('svg');
}
