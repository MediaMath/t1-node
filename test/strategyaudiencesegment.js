const BPromise = require('bluebird');
const expect = require('./chai_config').expect;
const sinon = require('sinon');
const t1 = require('../index');
const common = require('./test-common');

describe('strategy audience segments', () => {
  const connectionStub = {};
  connectionStub.get = function () {
  };
  connectionStub.post = function () {
  };
  connectionStub.buildQueryString = function () {
    return '';
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

  describe('#get strategy audience segments', () => {
    parsedResult = common.loadFixture('strategy-audience-segments');

    let audienceSegments = new t1.StrategyAudienceSegments();

    it('should have strategy audience segments', () => {
      audienceSegments = audienceSegments.get(1171990, connectionStub);

      return expect(audienceSegments).to.eventually
        .have.property('strategy_id', 1171990) &&

        expect(audienceSegments).to.eventually
          .have.property('include')
          .and.deep.equal([1358322, 1460324]) &&
        expect(audienceSegments).to.eventually
          .have.property('exclude')
          .and.deep.equal([1405158]) &&
        expect(audienceSegments).to.eventually
          .have.property('exclude_op')
          .and.equal('OR') &&
        expect(audienceSegments).to.eventually
          .have.property('include_op')
          .and.equal('AND');
    });
  });

  describe('#update audience', () => {
    parsedResult = common.loadFixture('strategy-audience-segments');

    const audienceSegments = new t1.StrategyAudienceSegments();
    audienceSegments.include = [1];
    audienceSegments.exclude = [119];
    audienceSegments.include_op = 'OR';
    audienceSegments.exclude_op = 'OR';


    it('should generate the correct formdata for posting', () => {
      const expected = {
        include_op: 'OR',
        exclude_op: 'OR',
        'segments.1.id': 1,
        'segments.1.restriction': 'INCLUDE',
        'segments.2.id': 119,
        'segments.2.restriction': 'EXCLUDE',
      };
      const formdata = audienceSegments.generateForm();

      return expect(formdata).to.eventually.deep.equal(expected);
    });
  });
});
