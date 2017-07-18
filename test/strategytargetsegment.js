'use strict'; // eslint-disable-line

const BPromise = require('bluebird');
const expect = require('./chai_config').expect;
const sinon = require('sinon');
const t1 = require('../index');
const common = require('./test-common');

describe('strategy target segments', () => {
  const connectionStub = {};
  connectionStub.get = function get() {
  };
  connectionStub.post = function post() {
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

  describe('#get strategy target segments', () => {
    parsedResult = common.loadFixture('strategy-targeting-segments');

    let targetingSegments = new t1.StrategyTargetSegments();

    it('should have strategy targeting segments', () => {
      targetingSegments = targetingSegments.get(1171990, connectionStub);

      return expect(targetingSegments).to.eventually
        .have.property('strategy_id', 1171990) &&

        expect(targetingSegments).to.eventually
          .have.property('include')
          .and.deep.equal([[119, 'OR'], [118, 'OR']]) &&
        expect(targetingSegments).to.eventually
          .have.property('exclude')
          .and.deep.equal([[1, 'OR']]) &&
        expect(targetingSegments).to.eventually
          .have.property('exclude_op')
          .and.equal('OR') &&
        expect(targetingSegments).to.eventually
          .have.property('include_op')
          .and.equal('OR');
    });
  });

  describe('#update targeting', () => {
    parsedResult = common.loadFixture('strategy-targeting-segments');

    const targetingSegments = new t1.StrategyTargetSegments();
    targetingSegments.include = [[1, 'OR']];
    targetingSegments.exclude = [[119, 'OR']];
    targetingSegments.include_op = 'OR';
    targetingSegments.exclude_op = 'OR';


    it('should generate the correct formdata for posting', () => {
      const expected = {
        include_op: 'OR',
        exclude_op: 'OR',
        'segments.1.id': 1,
        'segments.1.operator': 'OR',
        'segments.1.restriction': 'INCLUDE',
        'segments.2.id': 119,
        'segments.2.operator': 'OR',
        'segments.2.restriction': 'EXCLUDE',

      };
      const formdata = targetingSegments.generateForm();

      return expect(formdata).to.eventually.deep.equal(expected);
    });
  });
});
