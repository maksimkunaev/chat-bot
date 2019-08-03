const http = require('http')
const request = require('request');
let sid = '';
const authKey = 'chatBotAuthKey';
const login = 'Bot';
const password = 'Bot';
const io = require('socket.io-client');
const neural = require('./neural/neural');
const HOST = 'http://localhost';
const PORT = 8080;
const HOSTNAME = `${HOST}:${PORT}`;

const netName = 'v_9_9_4';
const net = {
  name: netName,
  netPath: `/Users/maxim/private/chat-bot/nets/${netName}/${netName}.net.json`
};

const socket = io.connect(`${HOSTNAME}`, {
	extraHeaders: {
    	Authorization: `Bearer ${authKey}`,
  	}
});
    
function ws() {
	socket.emit('init');
	socket.on('connect', function (arg) {
		console.log(`connect`,arg)
	}); 

	socket.on('newMessage', async (msg) => {
	const { text, dialogId, sentTo, sentBy } = msg;

	if (sentBy !== login) {
	    const output = neural.run(text, net);
		const message = { text: output, dialogId, sentTo }

		socket.emit('newMessage', message);
	}
		console.log(`newMessage`,msg)
	});
}

function sigInBot(req, res) {
	const body = {
		login,
		password,
	};

	const options = {
	  method: 'post',
	  body: body,
	  json: true,
	  url: HOSTNAME + '/login'
	}

	request(options, function (err, res, body) {
	  if (err) {
	    console.error('error posting json: ', err)
	    throw err
	  }
	  const statusCode = res.statusCode
	  if (statusCode === 200) {
	  	let cookies = res.headers['set-cookie'] || [];
	  	cookies = cookies[0] || '';
	  	cookies = cookies.split(';') || [];
	  	cookies = cookies[0] || [];
	  	cookies = cookies.split('=') || [];

	  	if (cookies[0] === 'sid') {
	  		sid = cookies[1];
	  	}

	  	ws();
	  } else {
	  	console.log('error: ')
	  }
	  console.log('sid: ', sid)
	})
}
sigInBot()
