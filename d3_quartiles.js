/* global d3 */
/* eslint-disable no-multi-spaces */
function getChart(ranks) { // eslint-disable-line no-unused-vars
  var labelData = [
    'Agenda Setting Influence',
    'Helpfulness in Implementation',
    'Usefulness of Advice'
  ];

  var w = 800,
      h = 350;

  var qWidth = 120,
      qMargin = 30;

  var numberOfDonors = 62;

  var svg = d3.select('body').append('svg')
    .attr('width', w)
    .attr('height', h);

  var bars = svg.append('g')
    .attr('transform', translation(120, 80));

  bars.selectAll('.bars')
    .data([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2])
    .enter()
    .append('rect')
      .attr('x', function(d, i) { return (qWidth + qMargin) * (i % 4); })
      .attr('y', function(d) { return d * 80 + 10; })
      .attr('width', qWidth)
      .attr('height', 30)
      .attr('fill', '#000')
      .attr('fill', function(d, i) {
        switch (i % 4) {
          case 0:
            return '#92b5d8';
          case 1:
            return '#76b657';
          case 2:
            return '#FFDD75';
          case 3:
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
      .call(wrap);


  svg.append('g').attr('transform', translation(120, 70))
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
  svg.append('g').attr('transform', translation(120, 80)).selectAll('.marker')
    .data([0, 1, 2])
    .enter()
    .append('rect')
      .attr('x', 280)
      .attr('y', function(d) { return  d * 80; })
      .attr('width', 10)
      .attr('height', 50)
      .attr('fill', '#A9A9A9');

  // rank markers
  svg.append('g').attr('transform', translation(120, 80)).selectAll('.rankMarker')
    .data(ranks.data)
    .enter()
    .append('rect')
      .attr('x', function(d) { return (d / numberOfDonors) * ((qWidth * 4) + (qMargin * 3)); })
      .attr('y', function(d, i) { return i * 80; })
      .attr('width', 10)
      .attr('height', 50)
      .attr('fill', '#000');

  // rank marker labels
  svg.append('g').attr('transform', translation(120, 80)).selectAll('.rankMarkerLabel')
    .data(ranks.data)
    .enter()
    .append('text')
      .text(ranks.donor)
      .attr('x', function(d) { return (d / numberOfDonors) * ((qWidth * 4) + (qMargin * 3)); })
      .attr('y', function(d, i) { return i * 80 + 65; });

  svg.selectAll('text')
    .style('font-family', 'Helvetica');

  function translation(x, y) {
    return 'translate(' + x + ',' + y + ')';
  }

  // shout out to @mbostock, luh u boo
  // remix of http://bl.ocks.org/mbostock/7555321 that will run in jsdom
  function wrap(text) {
    text.each(function() {
      var text = d3.select(this), // eslint-disable-line no-shadow
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = 0,
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (line.join().length > 14) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    });
  }
  return document.getElementsByTagName('svg')[0];
}
