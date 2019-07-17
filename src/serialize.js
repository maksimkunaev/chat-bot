const fixLengths = (data) => {

  let maxLengthInput = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].input.length > maxLengthInput) {
      maxLengthInput = data[i].input.length;
    }
  }

  for (let i = 0; i < data.length; i++) {
    while (data[i].input.length < maxLengthInput) {
      data[i].input.push(0);
    }
  }

  return data;
}

const encode = d => {
  const newArr = [];
  d.split('').map(c => {
    newArr.push((c.charCodeAt(0) / 255))
  })
  return newArr
}

const decode = data => {
  let newStr = '';
  for (let s = 0; s<data.length;s++) {
    newStr += String.fromCharCode(Math.round(data[s] * 255));
  }
  return newStr
}


const encodeData = data => {

  return data.map( d => {

    return {
      input:  encode(d.input),
      output: encode(d.output),
    }
  })
}

module.exports = {
  encode:     encode,
  encodeData: encodeData,
  decode: decode,
}
