const fixLengths = (data) => {
  let maxLengthInput = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i].input.length > maxLengthInput) {
      maxLengthInput = data[i].input.length;
    }
    if (data[i].output.length > maxLengthInput) {
      maxLengthInput = data[i].output.length;
    }
  }

  for (let i = 0; i < data.length; i++) {
    while (data[i].input.length < maxLengthInput) {
      data[i].input.push(0);
    }
    while (data[i].output.length < maxLengthInput) {
      data[i].output.push(0);
    }
  }

  return data;
}

module.exports = fixLengths;
