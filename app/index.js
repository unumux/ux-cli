#!/usr/bin/env node
require('babel/register')({
    stage: 1
});
require('./main.js')();
