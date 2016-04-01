var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');

chai.config.includeStack = true;

chai.use(chaiAsPromised);
chai.use(sinonChai);

module.exports = chai;
