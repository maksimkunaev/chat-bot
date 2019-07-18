const dataPath = '../data/papaya.txt';
const path = require('path');


function formatData(data) {
  let trainig_data = [];

  const arrayData = data.match(/(Q|A):\ (.*)/g).forEach(s => {
    const [type, text] = s.split(': ');

    const newText = text.replace(/_\w+/, ':)');
    if (type === 'Q') {
      trainig_data.push({
        input: newText,
      })
    }

    if (type === 'A') {
      trainig_data[trainig_data.length - 1].output = newText;
    }

  });
  return trainig_data;

}

// const trainData = formatData(data);

module.exports = formatData;
