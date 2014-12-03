#!/usr/bin/env node

'use strict';

var
    fs     = require('fs'),
    pastry = require('pastry'),

    hexJSONFile  = './data/json/hexByNamedColor.json',
    rgbJSONFile  = './data/json/rgbByNamedColor.json',
    rgbaJSONFile = './data/json/rgbaByNamedColor.json',

    hexByNamedColor  = pastry.JSON.parse(fs.readFileSync(hexJSONFile, 'utf8')),
    rgbByNamedColor  = {},
    rgbaByNamedColor = {};

    function completeColorHex (hex) {
        if (hex.length === 6) {
            return hex;
        }
        while(hex.length < 6) {
            hex = '0' + hex;
        }
        return hex;
    }
    function hex2rgbArray (hex) {
        hex = completeColorHex(hex.toString(16));
        return [
            parseInt(hex.substr(0, 2), 16),
            parseInt(hex.substr(2, 2), 16),
            parseInt(hex.substr(4, 2), 16)
        ];
    }
    function hex2rgbaArray (hex) {
        var arr = hex2rgbArray(hex);
        arr.push(1);
        return arr;
    }

// console.log(hexByNamedColor);

pastry.each(hexByNamedColor, function (hex, color) {
console.log(hex, color);
    rgbByNamedColor[color]  = hex2rgbArray(hex);
    rgbaByNamedColor[color] = hex2rgbaArray(hex);
});

fs.writeFileSync(rgbJSONFile , pastry.JSON.stringify(rgbByNamedColor, null, ' '));
fs.writeFileSync(rgbaJSONFile, pastry.JSON.stringify(rgbaByNamedColor, null, ' '));

