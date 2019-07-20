 var socket = io();

  socket.on('init', function(data){
    init(data);
  });

  socket.emit('init');

  function train(e) {
    const trainForm = document.querySelector('.train-form');
    const name = document.querySelector('#exampleInputName').value;
    const layers = document.querySelector('#exampleInputLayers').value;
    const iterations = document.querySelector('#exampleInputIterations').value;
    const data = document.querySelector('#exampleInputData').value;

    const settings = {
        config: {
        name,
          from: 0,
          to: Number(data),
        },
        net: {
          "hiddenLayers": layers.split(',').map(layers => Number(layers)),
        },
        training: {
        iterations: Number(iterations),
        erroThresh: 0.011,
      }
    }

    socket.emit('train', settings)
  }

  function init(data) {
    const netWrap = document.querySelector('.nets');
    const trainForm = document.querySelector('.train-form');
    const trainSubmit = document.querySelector('.train-submit');
    let netList = document.createElement('ul');
    netList.classList = 'list';
    const navList = document.querySelector('.navigation ul');
    navList.addEventListener('click', onMenuClick)
    trainForm.addEventListener('sumbit', train)
    trainSubmit.addEventListener('click', train)

    console.log(`trainForm`,trainForm)
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

    createtable(data[0].table);
    createConfig(data[0]) ;

    netWrap.appendChild(netList);

  }
 

function createtable(data) {
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
        netList.children[i].classList.add('active')
      } else {
        netList.children[i].classList.remove('active')
      }
    }
     console.log(event);

    const net = data.find(net => net.name === name);
    createtable(net.table)
    createConfig(net) ;
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

function createConfig(data) {
  const config = document.querySelector('.list-group.config');
  let settings = JSON.parse(data.settings) || [];
  const svgData = data.svg;

  console.log(`settings`, settings);

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
  console.log(svgData);
}