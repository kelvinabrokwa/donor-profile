/* eslint-disable */
var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');
var R = require('ramda');
var extend = require('xtend');

var dataCSV = fs.readFileSync(path.join(__dirname, 'data/data.csv'), { encoding: 'utf-8' });
var averageCSV = fs.readFileSync(path.join(__dirname, 'data/averages.csv'), { encoding: 'utf-8' });

parseData(dataCSV);

function parseData(csv) {
  var data = [];
  var header = true;
  var row;

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
    parseCSVAverages(averageCSV, data);
  });

  dataCSVParser.write(csv);
  dataCSVParser.end();
}

function parseCSVAverages(csv, data) {
  var averages = [];
  var header = true;
  var row;

  var averageCSVParser = parse();

  averageCSVParser.on('readable', function() {
    while (record = averageCSVParser.read()) {
      if (!header) {
        var row = {};
        for (var i = 0; i < record.length; i++) {
          row[head[i]] = record[i];
        }
        averages.push(row);
      } else {
        head = record;
        header = false;
      }
    }
  });

  averageCSVParser.on('finish', function() {
    generateBubbleChartData(data, averages);
  });

  averageCSVParser.write(csv);
  averageCSVParser.end();
}

function generateBubbleChartData(rawData, averageData) {
  var allDonorBubbleData = {
    dac: {
      pgc1: {
        q21: +averageData[1]['Q21_PGC1'],
        q14: +averageData[1]['Q14_PGC1'],
        oda: Math.random() * 5
      },
      pgc2: {
        q21: +averageData[1]['Q21_PGC2'],
        q14: +averageData[1]['Q14_PGC2'],
        oda: Math.random() * 5
      },
      pgc3: {
        q21: +averageData[1]['Q21_PGC3'],
        q14: +averageData[1]['Q14_PGC3'],
        oda: Math.random() * 5
      }
    },
    nonDac: {
      pgc1: {
        q21: +averageData[2]['Q21_PGC1'],
        q14: +averageData[2]['Q14_PGC1'],
        oda: Math.random() * 5
      },
      pgc2: {
        q21: +averageData[2]['Q21_PGC2'],
        q14: +averageData[2]['Q14_PGC2'],
        oda: Math.random() * 5
      },
      pgc3: {
        q21: +averageData[2]['Q21_PGC3'],
        q14: +averageData[2]['Q14_PGC3'],
        oda: Math.random() * 5
      }
    },
    multi: {
      pgc1: {
        q21: +averageData[0]['Q21_PGC1'],
        q14: +averageData[0]['Q14_PGC1'],
        oda: Math.random() * 5
      },
      pgc2: {
        q21: +averageData[0]['Q21_PGC2'],
        q14: +averageData[0]['Q14_PGC2'],
        oda: Math.random() * 5
      },
      pgc3: {
        q21: +averageData[0]['Q21_PGC3'],
        q14: +averageData[0]['Q14_PGC3'],
        oda: Math.random() * 5
      }
    }
  };

  console.log('var data =', JSON.stringify(flatten(allDonorBubbleData)));
  //console.log(JSON.stringify(flatten(allDonorBubbleData)));
}

// flatten the structure of the data above into an array
// containing data for the 9 bubbles
function flatten(d) {
  var flattened = [];
  for (var key in d) {
    for (var sub in d[key]) {
      var bubble = {
        group: key,
        type: sub
      }
      bubble = extend(bubble, d[key][sub]);
      flattened.push(bubble);
    }
  }
  return flattened;
}
/* eslint-enable */
