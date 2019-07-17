const brain      = require('brain.js')
const serializer = require('../src/serialize');

const lstm = new brain.recurrent.LSTM();

lstm.fromJSON(require('../nets/papaya2.json'));

const inputData = "Are you under the impression that Ebola was unknown before the most recent outbreak ? It is a reasonably well known about infection ."

const output = lstm.run(serializer.encode(inputData));

let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

// console.log(` answer`, answer);
answer = serializer.decode(answer)
console.log(`answer`, answer);
