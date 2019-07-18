const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const netPath = './nets';
const dataPath = './data';

app.use(express.static('static'));

app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`);
});

function startWs() {
	io.on('connection', (socket) => {
	console.log('connected');
    
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