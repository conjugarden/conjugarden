var http = require('http');
var url = require('url');
var fs = require('fs');
var child_process = require('child_process');

var TRANSLATE_CMD = '/usr/local/bin/translate.sh';


var g_data;
fs.readFile('data.json', 'utf8', function(err, str) {
	if (err) g_data = null;
	g_data = JSON.parse(str);
});

function show_word(key, resp)
{
	var info = g_data[key];
	resp.writeHead(200, { 'Content-Type': 'application/json' });
	if (info == undefined) {
		resp.write('{}');
	} else {
		resp.write(JSON.stringify(info));
	}
	resp.end();
}


function translate_text(text, resp) {
	var prc = child_process.spawn(TRANSLATE_CMD, [text]);
	prc.stdout.setEncoding('utf8');

	var out = '';
	var error;
	prc.stdout.on('data', function (data) {
		out += data.toString();
	});

	prc.on('error', function(err) {
		error = err;
	})

	prc.on('close', function (code) {
		var result = {};
		var status = 200;
		if (error) {
			status = 500;
			result.error = error.message;
			console.log(error);
		}
		result.out = out;
		resp.writeHead(status, { 'Content-Type': 'application/json' });
		resp.write(JSON.stringify(result));
		resp.end();
	});
}

var server = http.createServer(function(req, resp) {
	req_url = url.parse(req.url, true);

	if (req_url.query['action'] == 'quiz') {

		var keys = Object.keys(g_data);
		var key = keys[Math.floor(Math.random() * keys.length)];
		show_word(key, resp);

	} else if (req_url.query['action'] == 'query') {

		var key = req_url.query['word'];
		show_word(key, resp);

	} else if (req_url.query['action'] == 'translate') {
			var text = req_url.query['text'];
			translate_text(text, resp);

	} else if (req_url.pathname == '/favicon.ico') {
		resp.setHeader('Content-Type', 'image/x-icon');
		fs.createReadStream('assets/favicon.ico').pipe(resp);
		return;
		resp.end();
	} else if (req_url.pathname == '/spain-flag-with-bull.png') {
		resp.setHeader('Content-Type', 'image/png');
		fs.createReadStream('assets/spain-flag-with-bull.png').pipe(resp);
		return;
		resp.end();
	} else {

		resp.writeHead(200, { 'Content-Type': 'text/html' });
		fs.createReadStream('./assets/index.html').pipe(resp);
	};
});
server.listen(8080);
