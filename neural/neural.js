const brain      = require('brain.js')
const serializer = require('../utils/serialize');
const utils = require('../utils/index');
const fs = require('fs');
const path = require('path');
const { createSVG, createDefaulTable, getError, saveNet } = utils;
const defaultPath  = path.join(__dirname, "../nets/")

function train({trainingData, netPath, netConfig, training, name}) {
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

	const saveingConfig = {
		name,
		net,
		netPath,
		svg,
		defaultTable,
		defaultPath
	}
	saveNet(saveingConfig) 
}

function run({trainingData, netPath, netConfig}) {

}

module.exports = {
	train,
	run,
}