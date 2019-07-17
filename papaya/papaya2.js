const brain      = require('brain.js')
const serializer = require('../src/serialize');
const fs = require('fs');

const trainData = require('../data/papaya2-data-formatted-data');
console.log(`trainData.length`, trainData.length);

const net = new brain.recurrent.LSTM({
  hiddenLayers: [62, 62]
});

net.train(serializer.encodeData(trainData.slice(0, 100)), {
  iterations: 1500,
  errorThresh: 0.011,
  log: details => console.log(details),
});

let wstream = fs.createWriteStream('./papaya2.json');
wstream.write(JSON.stringify(net.toJSON(),null,2));
wstream.end();

