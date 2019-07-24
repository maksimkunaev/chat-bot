  const socket = io();
  let currentNet = {
    name: ''
  }

  const dialogs = [];

  socket.on('init', function(data){
    init(data);
  });

  socket.on('message', function(data){
    addMessageToDialog(data, 'bot')
  });
  socket.emit('init');

  function train(e) {
    const trainForm = document.querySelector('.train-form');
    const name = document.querySelector('#exampleInputName').value;
    const layers = document.querySelector('#exampleInputLayers').value;
    const iterations = document.querySelector('#exampleInputIterations').value;
    const data = document.querySelector('#exampleInputData').value;

    const netConfig = {};
    const hiddenLayers = layers.split(',').map(layers => Number(layers)).filter(layer => layer);
    if (hiddenLayers.length) {
      netConfig.hiddenLayers = hiddenLayers;
    }

    const settings = {
        config: {
        name,
          from: 100,
          to: 100 + Number(data),
        },
        net: netConfig,
        training: {
          iterations: Number(iterations),
          errorThresh: 0.0115,
      }
    }

    socket.emit('train', settings)
  }

  function init(data) {
    const netWrap = document.querySelector('.nets');
    const trainForm = document.querySelector('.train-form');
    const trainSubmit = document.querySelector('.train-submit');
    const sendMessageButton = document.querySelector('.send-message');
    // const inputMessage = document.querySelector('#messageInput');
    let netList = document.createElement('ul');
    netList.classList = 'list';
    const navList = document.querySelector('.navigation ul');
   
    navList.addEventListener('click', onMenuClick)
    trainForm.addEventListener('sumbit', train)
    trainSubmit.addEventListener('click', train)
    sendMessageButton.addEventListener('click', sendMessage)
    netWrap.innerHTML = null;
    data.forEach((item, index)  => {
        const li = document.createElement('li');
        li.classList = `list-group-item`;

        if (!index) {
          li.classList = li.classList + ` active`
        }

        li.addEventListener('click', onNetClick.bind(this, item.name, data));
        li.innerHTML = `<div class='net'>
            ${item.name}
          </div>`;

        netList.appendChild(li);  
    })

    const firstNet = data[0];
    currentNet = firstNet;
    if (firstNet) {
      renderTable(firstNet.table);
      renderConfig(firstNet);
    }
    netWrap.appendChild(netList);
  }
 

function renderTable(data) {
    const tableNode = document.querySelector('.table');

    const newData = JSON.parse(data);
    let tableData = ``;

    const tbody = newData.forEach((item, index) =>{
        tableData += `<tr>
          <th scope="row">${index}</th>
          <td>${item.input}</td>
          <td>${item.output}</td>
        </tr>`
    })
    const table = `<table class="table" cellpadding="0" border="0" cellspacing="0">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Input</th>
          <th scope="col">Output</th>
        </tr>
      </thead>
      <tbody>
        ${tableData}
      </tbody>
    </table>`

    tableNode.innerHTML = table;
    return table
  }
  
 function onNetClick(name, data, event) {
    const netList = document.querySelector('.nets ul');

    for (var i = 0; i < netList.children.length; i++) {
      const elem = netList.children[i];

      if (elem === event.target.closest('li')) {
        netList.children[i].classList.add('active');
      } else {
        netList.children[i].classList.remove('active')
      }
    }

    const net = data.find(net => net.name === name);
    currentNet = net;

    renderTable(net.table)
    renderConfig(net);
    renderDialog(name)
  }
   

const defaultData = {
  settings: [{name: 'iterations', value: 1000},{name: 'errorTrash', value: 0.011}]
}
function onMenuClick(event) {
  const elemClicked = event.target.closest('li');
  const navList = event.target.closest('ul')

  if (!elemClicked || !navList) return;

  for (var i = 0; i < navList.children.length; i++) {
    const elem = navList.children[i];
    const idFor = elem.getAttribute("data-id-for");

    if (elem === elemClicked) {
      elem.classList.add('active');
      const wrapper = document.querySelector(idFor);
      wrapper.style.opacity = 1;
      wrapper.style.pointerEvents = 'visible';

    } else {
      elem.classList.remove('active');
      const wrapper = document.querySelector(idFor);
      wrapper.style.opacity = 0;
      wrapper.style.pointerEvents = 'none';
    }
  }
}

function sendMessage(event) {
  event.preventDefault;
  const form = event.target.closest('form');
  const textInput = document.querySelector('#messageInput');
  socket.emit('message', {
    message: textInput.value,
    netName: currentNet.name
  })
  addMessageToDialog({output: textInput.value, netName: currentNet.name}, 'human')
  return false;
}

function renderConfig(data) {
  const config = document.querySelector('.list-group.config');
  let settings = data.settings || [];
  const svgData = data.svg;

  config.innerHTML = '';

  for (const key in settings) {
     const li = document.createElement('li');
      li.classList = `list-group-item`;

      li.innerHTML = `<div class='setting'>
         <div class='setting__key'>${key}</div> 
         <div class='setting__value'>${settings[key]}</div> 
        </div>`;

      config.appendChild(li);  
  }

  const svg = document.querySelector('.svg');
  svg.innerHTML = svgData;  
}

function addMessageToDialog({output, netName}, sentBy) {
  const dialogList = dialogs.find(dialog => dialog.name === netName);
  const botMessage = { message: output, sentBy };

  if (!dialogList) {
    dialogs.push({ name: netName, data: [ botMessage ]})
  } else {
    dialogList.data.push(botMessage);
  }

  renderDialog(netName)
}

function renderDialog(netName) {
  const dialogList = dialogs.find(dialog => dialog.name === netName) || [];
  const dialogElem = document.querySelector('.dialog');

  const messagesContent = dialogList.data.map(({message}) => {
    return `<li>${message}</li>`
  }) 

  dialogElem.innerHTML = messagesContent.join('');  
}