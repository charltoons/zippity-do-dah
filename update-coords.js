'use strict';
var csv2array = require('csv2array'),
fs = require('fs'),
path = require('path'),
_ = require('underscore'),
to_csv = require('to-csv');


var file = path.join(__dirname, 'data', 'zips.csv');
if(!fs.existsSync(file)) throw new Error('Data source not available: ' + file);

var raw = fs.readFileSync(file, {encoding : 'ascii'});
var rows = csv2array(raw);
rows.shift();

// file with the extended lat/lng
var extended_file = path.join(__dirname, 'data', 'zipcode.csv');
if(!fs.existsSync(extended_file)) throw new Error('Data source not available: ' + extended_file);

var extended = fs.readFileSync(extended_file, {encoding: 'ascii'});
var extended_rows = csv2array(extended);

extended_rows.shift()
var extended_data = []
for (var i=0; i<extended_rows.length; i++){
  if (extended_rows[i] && extended_rows[i][3] && extended_rows[i][4]){
    extended_data.push({
      zip: extended_rows[i][0],
      lat: extended_rows[i][3],
      lng: extended_rows[i][4]
    });
  }
}

var data;
var counter = 0;
console.log('starting: ', rows.length)
_.each(rows, function(row){
  data = _.findWhere(extended_data, {zip: row[0]});
  if (data){
    row[5] = data.lat
    row[6] = data.lng
  }
  counter++;
  if (counter % 1000 == 0) console.log(counter);
});

fs.writeFileSync(path.join(__dirname, 'data', 'zips.csv'), to_csv(rows));
