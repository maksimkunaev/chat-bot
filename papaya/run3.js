const brain      = require('brain.js')
const serializer = require('../src/serialize');

const lstm = new brain.NeuralNetwork();

lstm.fromJSON(require('../nets/papaya3.json'));

let inputData = "Hi"
inputData = serializer.encode(inputData);

while (inputData.length < 158) {
  inputData.push(0);
}
const output = lstm.run(inputData);

// let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

console.log(` output`, output);
// answer = serializer.decode(answer)
// console.log(`answer`, answer);
