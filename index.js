const total = require('./data/total.json');
const fs = require('fs');


console.log(`total`, total.length);
const result = total.filter(item => item.input.length > 1 && item.output.length > 1)
console.log(`result`, result.length);

let wstream = fs.createWriteStream('result.json');
wstream.write(JSON.stringify(result,null,2));
wstream.end();

