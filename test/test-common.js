const loadFixture = function (fixtureName) {
  const fs = require('fs');
  return fs.readFileSync(`${__dirname}/fixtures` + `/${fixtureName}.json`, 'utf8');
};

exports.loadFixture = loadFixture;
