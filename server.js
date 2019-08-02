const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const netPath  = path.join(__dirname, "./nets/")
const data = require('./data/total.json');
const neural = require('./neural/neural');
const fs = require('fs');
let netsDataSaved = [];
app.use(express.static('static'));

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`);
});

function startWs() {
	io.on('connection', (socket) => {
		console.log('connection', socket.id	)
		socket.on('init', () => {
			const netsData = [];
			const nets = fs.readdirSync(netPath)
			
			nets.forEach(netDir => {
			
				const currentDir = path.join(netPath, netDir);
				const files = fs.readdirSync(currentDir);
				const svgName = files.find(name => name.indexOf('image.svg') !== -1);
				const netName = files.find(name => name.indexOf('net.json') !== -1);
				const tableName = files.find(name => name.indexOf('table.json') !== -1);
				const settingsName = files.find(name => name.indexOf('settings.json') !== -1);
				const svg = fs.readFileSync(path.join(currentDir, svgName), 'utf8');
				const table = fs.readFileSync(path.join(currentDir, tableName), 'utf8');
				const net = fs.readFileSync(path.join(currentDir, netName), 'utf8');
				let settings = fs.readFileSync(path.join(currentDir, settingsName), 'utf8');
				settings = JSON.parse(settings);

				const inputRange = JSON.parse(net).options.inputRange;
				const outputSize = JSON.parse(net).options.outputSize;
    			const hiddenLayers = JSON.parse(net).options.hiddenLayers;;

    			settings.hiddenLayers = hiddenLayers;
    			settings.outputSize = outputSize;
    			settings.inputRange = inputRange;

    			const netSettings = {
					name: netDir,
					svg,
					table,
					settings,
					inputRange,
					outputSize
				};

				netsData.push(netSettings)
				netsDataSaved.push({
					name: netDir,
					netPath: path.join(currentDir, netName),
				})

			})
			socket.emit('init', netsData)

		})

	    socket.on('train', settings => {
	    	console.log(`train`)

	    	neural.train(settings)
	    });

	    socket.on('message', ({message, netName}) => {
		    const net = netsDataSaved.find(net => net.name === netName)
		    const output = neural.run(message, net);
		    console.log(`net`,net)
		    socket.emit('message', { output, netName })
		})

	    socket.on('disconnect', () => {
	      console.log('disconnected');
    	});
  	});
}

(async function () {
	http.listen(8081, () => {
		console.log('listening on *:8081');
	});
	
	startWs();
}());