const happy = require('./d-happy')
const sad   = require('./d-sad')

const moods = [
  ...happy,
  ...sad
];

module.exports = moods


/*
We're using the amazing spread operator, which will let us to spread our array into another one.
We could also use Array.push() or Array.concat(), but the spread operator is just beautiful :)
Btw, that's what we got:
[ { input: 'I am happy',        output: { happy: 1 } },
  { input: 'I feel fine',       output: { happy: 1 } },
  { input: 'What a good day!',  output: { happy: 1 } },
  { input: 'I am sad',          output: { sad: 1 } },
  { input: 'I feel bad',        output: { sad: 1 } },
  { input: 'Such a bad day',    output: { sad: 1 } }
]
*/
