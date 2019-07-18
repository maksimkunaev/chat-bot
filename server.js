const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const netPath  = path.join(__dirname, "./nets/")
const data = require('./data/total.json');
const neural = require('./neural/neural');
const fs = require('fs');

app.use(express.static('static'));

app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`);
});

function startWs() {
	io.on('connection', (socket) => {
	const netsData = [];

	const nets = fs.readdirSync(netPath)
	nets.forEach(netDir => {
		const currentDir = path.join(netPath, netDir);
		const files = fs.readdirSync(currentDir);
		const svgName = files.find(name => name.indexOf('image.svg') !== -1);
		const netName = files.find(name => name.indexOf('net.json') !== -1);
		const tableName = files.find(name => name.indexOf('table.json') !== -1);
		const svg = fs.readFileSync(path.join(currentDir, svgName), 'utf8');
		const table = fs.readFileSync(path.join(currentDir, tableName), 'utf8');

		netsData.push({
			name: netDir,
			svg,
			table,
		})

		socket.emit('init', netsData)

	})
    socket.on('train', () => {
    	console.log(`train`)
    	const settings = {
    		config: {
				name: 'chatV1',
	    		from: 0,
	    		to: 10,
    		},
    		net: {
    			// "hiddenLayers": [20, 20],
    		},
    		training: {
				iterations: 50,
				erroThresh: 0.011,
			}
    	}
		const { from, to, name } = settings.config;

		const config = {
			trainingData: data.slice(from, to),
			netPath: path.join(netPath, `${name}.json`),
			netConfig: settings.net,
			training: settings.training,
			name,
		}

    	neural.train(config)
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });
  });
}

(async function () {
	http.listen(8080, () => {
		console.log('listening on *:8080');
	});
	
	startWs();
}());