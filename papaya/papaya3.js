const brain      = require('brain.js')
const serializer = require('../src/serialize');
const fs = require('fs');
const fixLength = require('./fixLength');

let trainData = require('../data/papaya2-data-formatted-data');
trainData = serializer.encodeData(trainData.slice(0, 200));
trainData = fixLength(trainData);

console.log(`trainData.length`, trainData.length);

const net = new brain.NeuralNetwork({
  // hiddenLayers: [62, 62]
});
//
net.train(trainData, {
  iterations: 10,
  errorThresh: 0.011,
  log: details => console.log(details),
});
//
// // let wstream = fs.createWriteStream('./33.json');
// // wstream.write(JSON.stringify(trainData.slice(0,100),null,2));
// // wstream.end();

let wstream = fs.createWriteStream('./papaya3.json');
wstream.write(JSON.stringify(net.toJSON(),null,2));
wstream.end();
