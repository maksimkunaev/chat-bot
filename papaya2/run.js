const brain      = require('brain.js');
const config = require('./config');
const settings = config.settings;
const serializer = require('../utils/serialize');
const trainingData = settings.trainingData;

const lstm = new brain.recurrent.LSTM();

lstm.fromJSON(require(settings.netPath));

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const resultTable = trainingData.map(item => {
	const { input, output } = item;

	const encodedQuestion = serializer.encode(input)
	const result = lstm.run(encodedQuestion);

	const answer = decodeAnswer(result, serializer.decode);

	return {
		input,
		output: answer,
	}
})

console.table(resultTable)

readline.question(`Type your question: `, (question) => {
	const encodedQuestion = serializer.encode(question)
	const output = lstm.run(encodedQuestion);

	const answer = decodeAnswer(output, serializer.decode);
	console.log(`Answer: ${answer}!`)

	readline.close()
})

function decodeAnswer(output, decodeFunction) {
	let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

	answer = serializer.decode(answer)
	return  answer;
}