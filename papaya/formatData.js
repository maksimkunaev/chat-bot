const dataPath = '../data/papaya2.txt';
const path = require('path');

const data = fs.readFileSync(path.join(__dirname, dataPath), "utf-8");

function formatData(data) {
  let trainig_data = [];

  const arrayData = data.match(/(Q|A):\ (.*)/g).forEach(s => {
    const [type, text] = s.split(': ');

    const newText = text.replace('_func_val_client_code_show_picture_randomly_para1_good_morning', ':)');
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

const trainData = formatData(data);

module.exports = formatData;
