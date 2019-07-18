const path = require('path');
const data = require('../data/total.json');

const settings = {
	trainingData: data.slice(0, 100),
	netPath: path.join(__dirname, "../nets/net.json"),
}

const netConfig = {
	"hiddenLayers": [58, 58],
}

const training = {
	iterations: 1000,
	erroThresh: 0.011,
	log: details => console.log(details),
}

module.exports = {
	settings,
	training,
	netConfig,
}