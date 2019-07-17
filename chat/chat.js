const brain      = require('brain.js')
const serializer = require('../src/serialize');
const fs = require('fs');
const getData = require('../utils/formatData');
const data = require('../data/training-dataset.json');

let trainingData = getData(data);

console.log(`newTrain_data`, trainingData.slice(0, 50).map(a=>a.input));
// const net = new brain.recurrent.LSTM({
//   hiddenLayers: [20, 20, 20]
// });
// net.train(serializer.encodeData(trainingData.slice(0, 50)), {
//   iterations: 15000,
//   errorThresh: 0.011,
//   log: details => console.log(details),
// });

c
//


// let wstream = fs.createWriteStream('./training-formatted-data.json');
// wstream.write(JSON.stringify(JSON.stringify(trainingData.slice(0,2)),null,2));
// wstream.end();
