#!/usr/bin/env node
var mysql = require('mysql');
var fs = require('fs');

var config = require('../config.js');

var options = Object.assign({}, config.database, {multipleStatements: true});
var connection = mysql.createConnection(options);

var sql = fs.readFileSync(__dirname + '/../data/init.sql', 'utf8');

connection.query(sql, function (error, results, fields) {
  if (error) throw error;
  console.log('success')
});

connection.end();
