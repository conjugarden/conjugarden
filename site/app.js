var http = require('http');
var url = require('url');
var fs = require('fs');
var child_process = require('child_process');

var config = require('../config.js');
var database = require('./database.js');


function write_response(status, info, resp) {
	resp.writeHead(status, { 'Content-Type': 'application/json' });
	if (info == undefined) {
		resp.write('{}');
	} else {
		//console.log(info)
		resp.write(JSON.stringify(info));
	}
	resp.end();
}


function translate_text(text, resp) {
	var prc = child_process.spawn(config.translate_command, [text]);
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
		write_response(status, result, resp);
	});
}


function query_route(query, resp) {
	var result = {};

	database.fuzzy_find_word(query.word, function(err, word) {
		if (err) {
			result.error = err.message;
			return write_response(500, result, resp);
		}

		if (!word) {
			// TODO: call import script here and try again
			return write_response(200, result, resp);
		}

		database.fetch_all(word, function(result) {
			return write_response(200, result, resp);
		})
	})
}


function quiz_route(query, resp) {
	database.query('select * from infinitive order by rand() limit 1', function(err, res) {
		if (err) {
			status = 500;
			return write_response(500, {error: err.message}, resp);
		}

		database.fetch_all(res[0], function(result) {
			return write_response(200, result, resp);
		})
	})
}

var server = http.createServer(function(req, resp) {
	var req_url = url.parse(req.url, true);

	if (req_url.query['action'] == 'quiz') {
		quiz_route(req_url.query, resp)

	} else if (req_url.query['action'] == 'query') {
		query_route(req_url.query, resp)

	} else if (req_url.query['action'] == 'translate') {
			var text = req_url.query['text'];
			translate_text(text, resp);

	} else if (req_url.pathname == '/favicon.ico') {
		resp.setHeader('Content-Type', 'image/x-icon');
		fs.createReadStream(__dirname + '/assets/favicon.ico').pipe(resp);

	} else if (req_url.pathname == '/spain-flag-with-bull.png') {
		resp.setHeader('Content-Type', 'image/png');
		fs.createReadStream(__dirname + '/assets/spain-flag-with-bull.png').pipe(resp);

	} else {
		resp.writeHead(200, { 'Content-Type': 'text/html' });
		fs.createReadStream(__dirname + '/assets/index.html').pipe(resp);
	}
});
server.listen(config.port);
