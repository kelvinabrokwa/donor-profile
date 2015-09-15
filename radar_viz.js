var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var xmlserializer = require('xmlserializer');

writeChartsToDisk();

function writeChartsToDisk() {
  var scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js',
    'http://code.highcharts.com/highcharts.js',
    'http://code.highcharts.com/highcharts-more.js',
    'http://code.highcharts.com/modules/exporting.js',
    path.join('file://', __dirname, 'high_radar.js')
  ];
  jsdom.env({
    features: { QuerySelector: true },
    html: '<!DOCTYPE html><div id="chart"></div>',
    scripts: scripts,
    done: function(err, window) {
      if (err) throw err;
      window.insertRadar(null, function(svg) {
        fs.writeFileSync(
          path.join(__dirname, 'a.svg'),
          xmlserializer.serializeToString(svg),
          { encoding: 'utf-8' }
        );
        console.log(xmlserializer.serializeToString(svg));
      });
    }
  });
}
