
const serializer = require('../utils/serialize');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function  createDefaulTable(data, net) {
	const resultTable = data.map(item => {
		const { input, output } = item;

		const encodedQuestion = serializer.encode(input)
		const result = net.run(encodedQuestion);

		const answer = decodeAnswer(result, serializer.decode);

		return {
			input,
			output: answer,
		}
	})

	return resultTable;
}

function decodeAnswer(output) {
	let answer = output.split('0.').slice(1).map(num => Number(`0.${num}`))

	answer = serializer.decode(answer)
	return  answer;
}

function createSVG(data) {
	const width = 280;
	const height = 120;

	let sum = 0;
    for (let i = 0; i < data.length; i++) {
    	sum += data[i];
    }

    const avg = sum/data.length;
    const max = 1.5 * avg;

	const min = Math.min(...data);

	const stepX = width / data.length;
	const stepY = height / max;

	let path = ``;

	data.forEach((item, i) => {
		const y = height - (stepY * item);
		path += `L ${Math.round(stepX * i)} ${Math.round(y)}`;
	})
	
	const lastPoint = data[data.length - 1];
	const y = height - (stepY * lastPoint);
	const minPoint = height - (stepY * min);

	return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="outline: 1px solid #ccc" >
			<style>
				.text { font: italic 10px sans-serif; fill: #756f6f; }
			</style>
			<path d="M 0 0 ${path}" stroke-width="2px" stroke="#63e72c" fill="transparent"/>
			<text x="3%" y="${y * 0.8}" class="text">${min.toFixed(3)}</text>
			<line x1="0" y1="${minPoint}" x2="100%" y2="${minPoint}" stroke="rgba(117, 111, 111, 0.5)" />
		</svg>`;
}

function getError(details) {
	const error = details.match(/error: \d+.\w+/g).map(elem => Number(elem.replace('error: ', '')))[0];
	return error;
}

function saveNet(config) {
	const {
		name,
		net,
		netPath,
		svg,
		defaultTable,
		defaultPath,
		savingSettings
	} = config;

	const dirPath = path.join(defaultPath, `${name}`)

	mkdirp.sync(dirPath)

	const data = {
		net: JSON.stringify(net.toJSON(),null,2),
		svg,
		defaultTable,
	}

	saveStrem(dirPath, name + '.net.json', JSON.stringify(net.toJSON(),null,2))
	saveStrem(dirPath, name + '.image.svg', svg)
	saveStrem(dirPath, name + '.table.json', JSON.stringify(defaultTable))
	saveStrem(dirPath, name + '.settings.json', JSON.stringify(savingSettings))
}	

function saveStrem(dirPath, name, content) {
	let wstream = fs.createWriteStream(path.join(dirPath, `${name}`));
	wstream.write(content);
	wstream.end();
}

module.exports = {
	createSVG,
	createDefaulTable,
	getError,
	saveNet,
	decodeAnswer,
};
