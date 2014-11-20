#!/usr/bin/env node
'use strict';

var pastry = require('../../release/0.2.8/pastry.node.min.js');

console.log(pastry, pastry.JSON);

console.log(pastry.JSON.stringify(['hello', 'world']));

