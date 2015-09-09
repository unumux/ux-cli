#!/usr/bin/env node
var path = require('path');

// path to node_modules
var nmPath = path.join(__dirname, '../', 'node_modules');

var babel = require('babel/register')({
    stage: 1,
    ignore: nmPath // set to not compile anything inside node_modules
});
require('./main.js')();
