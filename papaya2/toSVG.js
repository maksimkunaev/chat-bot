const brain      = require('brain.js')
const serializer = require('../utils/serialize');
const fs = require('fs');
const path = require('path');
const config = require('./config_1');

const settings = config.settings;
const training = config.training;
const netConfig = config.netConfig;

// const net = new brain.recurrent.LSTM(netConfig);
const size = [5,5,5];
const net = new brain.NeuralNetwork({
					inputSize: size[0],
					inputRange: size[0],
					hiddenLayers: size.slice(1,size.length-1),
					outputSize: size[size.length-1]
				});


const svg = brain.utilities.toSVG(net);
console.log(`svg`,svg)
// const trainingData = settings.trainingData.slice(settings.startElem, settings.maxLength);

// console.log(`trainingData`,trainingData)
// net.train(serializer.encodeData(settings.trainingData.slice(settings.startElem, settings.maxLength)), training);

let wstream = fs.createWriteStream('net.svg');
wstream.write(svg);
wstream.end();