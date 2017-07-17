const fs = require('fs');

const loadFixture = function loadFixture(fixtureName) {
  return fs.readFileSync(`${__dirname}/fixtures/${fixtureName}.json`, 'utf8');
};

exports.loadFixture = loadFixture;
