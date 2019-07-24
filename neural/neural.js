const brain      = require('brain.js')
const serializer = require('../utils/serialize');
const utils = require('../utils/index');
const fs = require('fs');
const path = require('path');
const { createSVG, createDefaulTable, getError, saveNet, decodeAnswer } = utils;
const defaultPath  = path.join(__dirname, "../nets/")
const data = require('../data/total.json');
const netsPath  = path.join(__dirname, "../nets/");

function train(settings) {
	const { from, to, name } = settings.config;

	const config = {
		trainingData: data.slice(from, to),
		netPath: path.join(netsPath, `${name}.json`),
		netConfig: settings.net,
		training: settings.training,
	}
	const { trainingData, netConfig, netPath, training } = config;
	const net = new brain.recurrent.LSTM(netConfig);
	const errors = [];
	const trainingConfig = {
		...training,
		log: details => {
			console.log(details);
			errors.push(getError(details))
		},
		logPeriod: 1,    
	}
	console.log(`trainingConfig`, trainingConfig)
	const startTime = Date.now();
	net.train(serializer.encodeData(trainingData), trainingConfig);
	const trainTime = (Date.now() - startTime) / 1000;

	const svg = createSVG(errors);
	const defaultTable = createDefaulTable(trainingData, net)

	const savingSettings = {
		trainingData: trainingData.length,
		name,
		...settings.net,
		...settings.training,
		trainTime,
		iterations: errors.length,
	}
	
	const saveingConfig = {
		name,
		net,
		netPath,
		svg,
		defaultTable,
		defaultPath,
		savingSettings,
	}
	saveNet(saveingConfig) 
}

function run(message, net) {
	console.log(`message`, message)
	console.log(`netPath`, net)
	const lstm = new brain.recurrent.LSTM();
	lstm.fromJSON(require(net.netPath));

	const encodedQuestion = serializer.encode(message)
	const output = lstm.run(encodedQuestion);

	const answer = decodeAnswer(output, serializer.decode);
	console.log(`Answer: ${answer}!`)
	return answer;
}

module.exports = {
	train,
	run,
}