const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const netPath  = path.join(__dirname, "./nets/")
// const data = require('./data/total.json');
const neural = require('./neural/neural');
const fs = require('fs');

app.use(express.static('static'));

app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`);
});

function startWs() {
	io.on('connection', (socket) => {
		console.log('connection', socket.id	)
		socket.on('init', () => {
			console.log('init', socket.id)
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
				const settings = fs.readFileSync(path.join(currentDir, settingsName), 'utf8');

				netsData.push({
					name: netDir,
					svg,
					table,
					settings,
				})

				socket.emit('init', netsData)
			})
		})

	    socket.on('train', () => {
	    	console.log(`train`)
	    	const settings = {
	    		config: {
					name: 'robot_borya_5',
		    		from: 20,
		    		to: 40,
	    		},
	    		net: {
	    			"hiddenLayers": [50, 50, 50],
	    		},
	    		training: {
					iterations: 500,
					erroThresh: 0.011,
				}
	    	}

	    	neural.train(settings)
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