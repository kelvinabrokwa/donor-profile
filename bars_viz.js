var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var parse = require('csv-parse');
var R = require('ramda');

var dataCSV = fs.readFileSync(path.join(__dirname, 'data/data.csv'), { encoding: 'utf-8' });
var countryCSV = fs.readFileSync(path.join(__dirname, 'data/country.csv'), { encoding: 'utf-8' });

var countryKeys, data;

parseCountries(countryCSV);

function parseCountries(csv) {
  countryKeys = {};
  var header = true;
  var countryCSVParser = parse();
  var record;

  countryCSVParser.on('readable', function() {
    while (record = countryCSVParser.read()) {
      if (!header) {
        countryKeys[record[0]] = record[3];
      } else {
        header = false;
      }
    }
  });

  countryCSVParser.on('finish', function() {
    parseData(dataCSV);
  });

  countryCSVParser.write(csv);

  countryCSVParser.end();
}

function parseData(csv) {
  data = [];
  var header = true;
  var row, record, head;

  var dataCSVParser = parse();

  dataCSVParser.on('readable', function() {
    while (record = dataCSVParser.read()) {
      if (!header) {
        row = {};
        for (var i = 0; i < record.length; i++) {
          row[head[i]] = record[i];
        }
        data.push(row);
      } else {
        head = record;
        header = false;
      }
    }
  });

  dataCSVParser.on('finish', function() {
    generateBarChartData(data);
  });

  dataCSVParser.write(csv);

  dataCSVParser.end();
}

function generateBarChartData(rawData) {
  var barData = rawData.map(function(donor) {

    var donorData = {};

    donorData.name = donor['Name of Donor'];

    var q21Keys = Object.keys(donor).filter(function(key) {
      return key.indexOf('Q21_C') > -1;
    });

    var order = function(a, b) { return parseInt(a.q21) - parseInt(b.q21); };
    donorData.top5 = R.take(5, R.sort(order, q21Keys.map(function(key) {
      var countryCode = key.match(/C\d*$/)[0];
      return {
        countryName: countryKeys[countryCode],
        q14: parseInt(donor['Q14_' + countryCode] || 0),
        q25: parseInt(donor['Q25_' + countryCode] || 0),
        q21: donor[key]
      };
    })));

    return donorData;
  });

  for (var i = 0; i < barData.length; i++) {
    for (var j = 0; j < 2; j++) {
      var json = generateVegaJSON(barData[i], 'countryName', ['q14', 'q21'][j]);
      fs.writeFileSync(
        path.join(__dirname, 'bar_viz.json'),
        JSON.stringify(json),
        { encoding: 'utf-8' }
      );
      exec('./node_modules/vega/bin/vg2svg ' +
          'bar_viz.json ' +
          'graphics/bar_chart_' + ['q14', 'q21'][j] + '_' + barData[i].name + '.svg');
    }
  }
}

function generateVegaJSON(donorData, NAME_FIELD, VALUE_FIELD) {

  var viz = {
    width: 500,
    height: 200,
    padding: { top: 50, left: 80, bottom: 50, right: 80 },
    data: [
      {
        name: 'table',
        values: donorData.top5
      }
    ],
    scales: [
      {
        name: 'name_scale',
        type: 'ordinal',
        range: 'height',
        domain: { data: 'table', field: NAME_FIELD }
      },
      {
        name: 'q14_scale',
        type: 'linear',
        range: 'width',
        domain: { data: 'table', field: VALUE_FIELD },
        nice: true
      }
    ],
    axes: [
      {
        type: 'y',
        scale: 'name_scale'
      },
      {
        type: 'x',
        scale: 'q14_scale'
      }
    ],
    marks: [
      {
        name: 'bars',
        type: 'rect',
        from: { data: 'table' },
        properties: {
          enter: {
            y: {
              scale: 'name_scale',
              field: NAME_FIELD
            },
            height: {
              scale: 'name_scale',
              band: true,
              offset: -1
            },
            x: {
              scale: 'q14_scale',
              field: VALUE_FIELD
            },
            x2: {
              scale: 'q14_scale',
              value: 0
            }
          },
          update: {
            fill: { value: '#161f34' }
          },
          hover: {
            fill: { value: 'red' }
          }
        }
      }
    ]
  };

  return viz;
}
