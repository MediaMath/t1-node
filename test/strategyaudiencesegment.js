var BPromise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var t1 = require('../index');
var common = require('./test-common');

describe('strategy audience segments', function () {

  var connectionStub = {};
  connectionStub.get = function () {
  };
  connectionStub.post = function () {
  };
  connectionStub.buildQueryString = function () {
    return '';
  };
  var sandbox;
  var parsedResult = 'aisdaiusd';

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    sandbox.stub(connectionStub, 'get').returns(BPromise.try(function () {
      return parsedResult;
    }));
    sandbox.stub(connectionStub, 'post').returns(BPromise.try(function () {
      return parsedResult;
    }));
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#get strategy audience segments', function () {
    parsedResult = common.loadFixture('strategy-audience-segments');

    var audienceSegments = new t1.StrategyAudienceSegments();

    it('should have strategy audience segments', function () {
      audienceSegments = audienceSegments.get(1171990, connectionStub);

      return expect(audienceSegments).to.eventually.
        have.property('strategy_id', 1171990) &&

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

  describe('#update audience', function () {
    parsedResult = common.loadFixture('strategy-audience-segments');

    var audienceSegments = new t1.StrategyAudienceSegments();
    audienceSegments.include = [1];
    audienceSegments.exclude = [119];
    audienceSegments.include_op = 'OR';
    audienceSegments.exclude_op = 'OR';


    it('should generate the correct formdata for posting', function () {

      var expected = {
        'include_op': 'OR',
        'exclude_op': 'OR',
        'segments.1.id': 1,
        'segments.1.restriction': 'INCLUDE',
        'segments.2.id': 119,
        'segments.2.restriction': 'EXCLUDE'
      };
      var formdata = audienceSegments._generateForm();

      return expect(formdata).to.eventually.deep.equal(expected);
    });
  });
});
