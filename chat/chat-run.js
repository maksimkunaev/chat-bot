const brain      = require('brain.js')
const serializer = require('../src/serialize');

const lstm = new brain.recurrent.LSTM();

lstm.fromJSON(require('../nets/training-formatted-data.json'));

const inputData = "I like party hard on drum and base raves"

const output = lstm.run(serializer.encode(inputData));

let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

// console.log(` answer`, answer);
answer = serializer.decode(answer)
console.log(`answer`, answer);
