const brain      = require('brain.js')
const serializer = require('../utils/serialize');
const utils = require('../utils/index');
const fs = require('fs');
const path = require('path');
const { createSVG, createDefaulTable, getError, saveNet } = utils;
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
			errors.push(getError(details))},
	}

	net.train(serializer.encodeData(trainingData), trainingConfig);

	const svg = createSVG(errors);
	const defaultTable = createDefaulTable(trainingData, net)

	const savingSettings = {
		trainingData: trainingData.length,
		name,
		...settings.net,
		...settings.training,
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

function run({trainingData, netPath, netConfig}) {

}

module.exports = {
	train,
	run,
}