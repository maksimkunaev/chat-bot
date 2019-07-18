const path = require('path');

const settings = {
	trainingData: require('../data/total.json'),
	netPath: path.join(__dirname, "../nets/total.json"),
	maxLength: 2000,
	startElem: 0,
}

const netConfig = {
	"hiddenLayers": [59, 59, 59],
}

const training = {
	iterations: 1500,
	erroThresh: 0.011,
	log: details => console.log(details),
}

module.exports = {
	settings,
	training,
	netConfig,
}