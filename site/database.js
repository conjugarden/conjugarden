const sqlite3 = require('sqlite3').verbose();

var config = require('../config.js');

function fuzzy_find_word(word, callback) {
    console.log('fuzzy_find_word');
	query("SELECT * FROM infinitive WHERE infinitive = ? LIMIT 1", [word], function(err, rows) {
		if (err) return callback(err);
		if (rows[0]) return callback(null, rows[0]);
		query("SELECT * FROM infinitive WHERE infinitive_english LIKE ? LIMIT 1", ['%'+word+'%'], function(err, rows) {
			if (err) return callback(err);
			callback(null, rows[0]);
		})
	});
}

function fetch_all(word, callback) {
	console.log('fetch_all');
	var result = {}
	result.word = word.infinitive;
	result.meaning = word.infinitive_english;

		query("SELECT * FROM verbs WHERE infinitive = ?", [word.infinitive], function(err, conj) {
			result.conj = conj;
			query("SELECT * FROM gerund WHERE infinitive = ? LIMIT 1", [word.infinitive], function(err, r) {
				if (r && r[0]) {
					result.gerund = r[0].gerund;
					result.gerund_english = r[0].gerund_english;
				}
				query("SELECT * FROM pastparticiple WHERE infinitive = ? LIMIT 1", [word.infinitive], function(err, r) {
					if (r && r[0]) {
						result.past = r[0].pastparticiple;
						result.past_english = r[0].pastparticiple_english;
					}
					callback(result);
				})
			})
		})
}

function query(sql, params, callback) {
    console.log('query');
    let db = new sqlite3.Database('../conjugarden.db');
    db.all(sql, params, (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
        db.close();
        callback(err, rows);
    });
}

exports.query = query
exports.fuzzy_find_word = fuzzy_find_word
exports.fetch_all = fetch_all
