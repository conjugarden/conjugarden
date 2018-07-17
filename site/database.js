
var mysql = require('mysql');
var config = require('../config.js');

function fuzzy_find_word(word, callback) {
	connect(function(err, conn) {
		_query(conn, "SELECT * FROM infinitive WHERE infinitive = ? LIMIT 1", [word], function(err, results) {
			if (err) return callback(err);
			if (results[0]) return callback(null, results[0]);
			_query(conn, "SELECT * FROM infinitive WHERE infinitive_english LIKE ? LIMIT 1", ['%'+word+'%'], function(err, results) {
				if (err) return callback(err);
				callback(null, results[0]);
			})
		});
	})
}

function fetch_all(word, callback) {
	var result = {}
	result.word = word.infinitive;
	result.meaning = word.infinitive_english;

	connect(function(err, conn) {
		_query(conn, "SELECT * FROM verbs WHERE infinitive = ?", [word.infinitive], function(err, conj) {
			result.conj = conj;
			_query(conn, "SELECT * FROM gerund WHERE infinitive = ? LIMIT 1", [word.infinitive], function(err, r) {
				if (r && r[0]) {
					result.gerund = r[0].gerund;
					result.gerund_english = r[0].gerund_english;
				}
				_query(conn, "SELECT * FROM pastparticiple WHERE infinitive = ? LIMIT 1", [word.infinitive], function(err, r) {
					if (r && r[0]) {
						result.past = r[0].pastparticiple;
						result.past_english = r[0].pastparticiple_english;
					}
					callback(result);
				})
			})
		})
	})
}

function _query(connection, sql, params, callback) {
	connection.query(sql, params, function(err, results, fields) {
		if (err) {
			console.error('database query error', err);
			connectionError = err
		}
		callback(err, results, fields);
	});
}

function query(sql, params, callback) {
	connect(function(err, connection) {
		if (err) return callback(err);
		_query(connection, sql, params, callback);
	})
}

// share the connection, reconnect on any error
var connection, connectionError;
function connect(callback) {
	if (connectionError) {
		connection.destroy();
		connection = connectionError = false;
	}
	if (connection) {
		callback(null, connection);
	} else {
		connection = mysql.createConnection(config.database);
		connection.connect(function(err) {
			if (err) {
				console.error('database connection error', err);
				connectionError = err;
			}
			callback(err, connection);
		});
	}
}

exports.query = query
exports.fuzzy_find_word = fuzzy_find_word
exports.fetch_all = fetch_all
