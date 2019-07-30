const brain = require('brain.js');

const trainingData = [
    { input: 'I am super happy!', output: 'happy' },
    { input: 'What a pill!', output: 'sarcastic' },
];

const net = new brain.recurrent.LSTM();
net.train(trainingData, {
    iterations: 3,
    erroThresh: 0.011,
    log: details => console.log(details),
});

console.log(net.run('I am unhappy!'));
console.log(net.run('I am happy!'));

// bonus: add five new examples i