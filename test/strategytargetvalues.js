'use strict'; // eslint-disable-line

const BPromise = require('bluebird');
const expect = require('./chai_config').expect;
const sinon = require('sinon');
const t1 = require('../index');
const common = require('./test-common');

describe('strategy target values', () => {
  const connectionStub = {};
  connectionStub.get = function () {
  };
  connectionStub.post = function () {
  };
  let sandbox;
  let parsedResult = 'aisdaiusd';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(connectionStub, 'get').returns(BPromise.try(() => parsedResult));
    sandbox.stub(connectionStub, 'post').returns(BPromise.try(() => parsedResult));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#get strategy target values', () => {
    parsedResult = common.loadFixture('strategy-target-values');
    let targetingSegments = new t1.StrategyTargetValues();
    it('should have strategy target dimensions and values', () => {
      targetingSegments = targetingSegments.get(123456, connectionStub);

      const expectedDimensions = [
        {
          code: 'REGN',
          operation: 'OR',
          restriction: 'INCLUDE',
          value_ids: [251, 23],
        },
        {
          code: 'REGN',
          operation: 'OR',
          restriction: 'EXCLUDE',
          value_ids: [31],
        },
        {
          code: 'DMAX',
          operation: 'OR',
          restriction: 'INCLUDE',
          value_ids: [99846],
        }];

      return expect(targetingSegments).to.eventually
        .have.property('strategy_id', 123456) &&
        expect(targetingSegments).to.eventually
          .have.property('dimensions')
          .and.deep.equal(expectedDimensions);
    });
  });

  describe('#update targeting', () => {
    const targetingDimensions = new t1.StrategyTargetValues();
    targetingDimensions.addTargetValues('REGN', 'INCLUDE', 'OR', [23, 251]);
    targetingDimensions.addTargetValues('REGN', 'EXCLUDE', 'OR', [31]);
    targetingDimensions.addTargetValues('DMAX', 'INCLUDE', 'OR', [99846]);

    it('should generate the correct formdata for posting', () => {
      const expected = {
        'dimensions.1.code': 'REGN',
        'dimensions.1.restriction': 'INCLUDE',
        'dimensions.1.operation': 'OR',
        'dimensions.1.value_ids': '23,251',
        'dimensions.2.code': 'REGN',
        'dimensions.2.restriction': 'EXCLUDE',
        'dimensions.2.operation': 'OR',
        'dimensions.2.value_ids': '31',
        'dimensions.3.code': 'DMAX',
        'dimensions.3.restriction': 'INCLUDE',
        'dimensions.3.operation': 'OR',
        'dimensions.3.value_ids': '99846',
      };
      const formdata = targetingDimensions.generateForm();

      return expect(formdata).to.eventually.deep.equal(expected);
    });
  });
});
