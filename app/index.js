#!/usr/bin/env node
var path = require('path');

// path to node_modules
var nmPath = path.join(__dirname, '../', 'node_modules');

require('babel-register');
require('babel-polyfill');

require('./main.js')();
