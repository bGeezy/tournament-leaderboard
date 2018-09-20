'use strict';

const fs = require('fs');
const Leaderboard = require('./leaderboard.module.js');
const path = process.argv[2] ? './'+process.argv[2]+'.txt' : './input.txt';

fs.readFile(path, 'utf-8', function (err, text) {

    const input = text.trim().split(/\n/g).map(str => str.trim());

    const output = Leaderboard(input);

});
