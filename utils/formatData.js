// const formatData = dialogs => {
//   const train_data = dialogs.reduce(
//     (acc, { sender_class, text, ...rest }, i) => {
//       const lastElem = acc[acc.length - 1];
//
//       if (!lastElem) {
//         return [...acc, { sender_class, text, ...rest}];
//       }
//
//       if (Object(lastElem).sender_class === sender_class) {
//         acc[acc.length - 1].text = acc[acc.length - 1].text + ". " + text;
//         return acc;
//       }
//       return [...acc, { sender_class, text, ...rest }];
//     },
//     []
//   );
//
//   return train_data;
// }

const formatData = dialogs => {
  let train_data = dialogs.reduce(
    (acc, { sender_class, text, ...rest }, i) => {
      const lastElem = acc[acc.length - 1];

      if (!lastElem) {
        return [...acc, { sender_class, text, ...rest}];
      }

      if (Object(lastElem).sender_class === sender_class) {
        acc[acc.length - 1].text = acc[acc.length - 1].text + ". " + text;
        return acc;
      }
      return [...acc, { sender_class, text, ...rest }];
    },
    []
  );

  if (train_data.length % 2) {
    train_data.pop();
  }

  let newTrain_data = [];

  for (let i=1;i<=train_data.length;i++) {
    const text = train_data[i - 1].text;

    if (i % 2) {
      newTrain_data.push({
        input: text,
      })
    } else {
      newTrain_data[newTrain_data.length - 1].output = text;
    }
  }

  return newTrain_data;
}

const getData = data => {
  let training_data = [];
  data.map(item => {

    const dialogsSet = formatData(item.dialog);
    training_data = training_data.concat(dialogsSet);
  })

  return training_data;
}

module.exports = getData;
