const brain      = require('brain.js')
const serializer = require('../utils/serialize');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const settings = config.settings;
const training = config.training;
const netConfig = config.netConfig;

const net = new brain.recurrent.LSTM(netConfig);

const trainingData = settings.trainingData.slice(settings.startElem, settings.maxLength);

console.log(`trainingData`,trainingData)
net.train(settings.trainingData.slice(settings.startElem, settings.maxLength), training);

let wstream = fs.createWriteStream(settings.netPath);
wstream.write(JSON.stringify(net.toJSON(),null,2));
wstream.end();