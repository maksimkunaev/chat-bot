const tf = require('@tensorflow/tfjs-node');

// Optional Load the binding:
// Use '@tensorflow/tfjs-node-gpu' if running with GPU.
// require('@tensorflow/tfjs-node-gpu');

const serializer = require('./utils/serialize');
const utils = require('./utils/index');
const { createSVG, createDefaultTable, getError, saveNet, decodeAnswer } = utils;

const data = [
  {
    "input": "john",
    "output": "boy"
  },
  {
    "input": "ann",
    "output": "girl"
  },
  {
    "input": "alice",
    "output": "girl"
  },
  {
    "input": "john",
    "output": "boy"
  }
]

const newData = serializer.encodeData(data);
const inputData = newData.map(obj => obj.input);
const outputData = newData.map(obj => obj.output);
console.log(outputData)
const inputShape = inputData[0].length;
const units = outputData[0].length;

const model = tf.sequential();
model.add(tf.layers.dense({units: units, inputShape: [inputShape]}));

model.compile({loss: 'meanSquaredError', optimizer: 'sgd' });

// // Generate some synthetic data for training.
const xs = tf.tensor2d(inputData);

const ys = tf.tensor2d(outputData);

const startdDate = Date.now();
// Train the model using the data.
model.fit(xs, ys, { epochs: 350 }).then(() => {
	console.log('Trainig complete!')
	console.log('Date:', (Date.now() - startdDate) / 1000)
  // Use the model to do inference on a data point the model hasn't seen before:
  const output = model.predict(tf.tensor2d([inputData[3]])).dataSync();

  const answer = serializer.decode(output)
  console.log(`output`, output)
  console.log(`answer`, answer)

  // Open the browser devtools to see the output
});



  // TODO(cais): Recurrent dropout is currently not fully working.
  //   Make it work and add a flag to train-rnn.js.