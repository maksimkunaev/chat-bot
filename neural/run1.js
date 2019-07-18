const brain      = require('brain.js');
const path = require('path');
const fs = require('fs');

const serializer = require('../utils/serialize');
// const trainingData = settings.trainingData;
const netsPath  = path.join(__dirname, "../nets/")

const lstm = new brain.recurrent.LSTM();

// lstm.fromJSON(require(settings.netPath));

// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

const nets = fs.readdirSync(netsPath)

nets.forEach(file => {
	const netPath  = path.join(netsPath, file)
	const netJson = require(netPath);

	const { net, svg, defaultTable } = netJson;
	console.log(`net`,net)
	const lstm = new brain.recurrent.LSTM();

	lstm.fromJSON(JSON.stringify(net));

	readline.question(`Type your question: `, (question) => {
	const encodedQuestion = serializer.encode(question)
	const output = lstm.run(encodedQuestion);

	const answer = decodeAnswer(output, serializer.decode);
	console.log(`Answer: ${answer}!`)

	readline.close()
})
})

// const resultTable = trainingData.map(item => {
// 	const { input, output } = item;

// 	const encodedQuestion = serializer.encode(input)
// 	const result = lstm.run(encodedQuestion);

// 	const answer = decodeAnswer(result, serializer.decode);

// 	return {
// 		input,
// 		output: answer,
// 	}
// })

// console.table(resultTable)



function decodeAnswer(output, decodeFunction) {
	let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

	answer = serializer.decode(answer)
	return  answer;
}