/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.config.includeStack = true;

chai.use(chaiAsPromised);
chai.use(sinonChai);

module.exports = chai;
