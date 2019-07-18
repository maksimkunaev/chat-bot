const brain      = require('brain.js');
const config = require('./config');
const settings = config.settings;

const lstm = new brain.recurrent.LSTM();

lstm.fromJSON(require(settings.netPath));

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question(`Type your question: `, (question) => {
	const output = lstm.run(question);

	console.log(`Answer: ${output}!`)
	readline.close()
})