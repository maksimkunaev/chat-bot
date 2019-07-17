const brain      = require('brain.js')
const serializer = require('./src/serialize');
const fs = require('fs');

const trainingData = [
  {
    input: 'Hi',
    output: 'Hi!, welcome to room!',
  },

  {
    input: 'Hello',
    output:  'Hello!, welcome to room!',
  },

  {
    input: 'Good day!',
    output:  'Hello!, welcome to room!',
  },

  {
    input: 'Good morning',
    output:  'Good morning!, welcome to room!',
  },
  {
    input: 'Hello, I\'m Max',
    output:  'Hey Max!',
  },
  {
    input: 'Hello, I\'m Ostin',
    output:  'Hey Ostin!',
  },
  {
    input: 'Hello, I\'m Peter',
    output:  'Hey Peter!',
  },
  {
    input: 'Hello, I\'m John',
    output:  'Hey John!',
  },
  {
    input: 'What is your name?',
    output:  'My name is Bot',
  },
  {
    input: 'What do you do?',
    output:  'I can talk with you about stars. Do you like stars?',
  },
];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(serializer.serialize(trainingData), {
  iterations: 1500,
  errorThresh: 0.015,
  log: details => console.log(details),
});


let wstream = fs.createWriteStream('./json-net.json');
wstream.write(JSON.stringify(lstm.toJSON(),null,2));
wstream.end();

// console.log(`input`,encode('Tell a story!'))
// const run1 = lstm.run(encode("Hello I'm Cris!"));
// const run2 = lstm.run('Doug');
// const run3 = lstm.run('Spot');
// const run4 = lstm.run('It');

// let answer = run1.split('0.').slice(1).map(num => Number(`0.${num}`))
// const resultAnswer = decodeData(answer);

// console.log('resultAnswer: ' + resultAnswer);
// console.log('run 2: Doug' + run2);
// console.log('run 3: Spot' + run3);
// console.log('run 4: It' + run4);
//
