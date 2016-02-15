var Promise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var t1 = require('../index');
var common = require('./test-common');

describe("strategy target segments", function () {

    var connectionStub = {};
    connectionStub.get = function () {
    };
    connectionStub.post = function () {
    };
    var sandbox, getStub, postStub;
    var parsedResult = "aisdaiusd";

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        getStub = sandbox.stub(connectionStub, "get").returns(Promise.try(function () {
            return parsedResult
        }));
        postStub = sandbox.stub(connectionStub, "post").returns(Promise.try(function () {
            return parsedResult
        }));
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("#get strategy target segments", function () {
        parsedResult = common.loadFixture('strategy-targeting-segments');

        var targetingSegments = new t1.StrategyTargetSegments();

        it("should have strategy targeting segments", function () {
            targetingSegments = targetingSegments.get(1171990, connectionStub);

            return expect(targetingSegments).to.eventually
                    .have.property('strategy_id', 1171990) &&

                expect(targetingSegments).to.eventually
                    .have.property('include')
                    .and.deep.equal([[119, 'OR'], [118, 'OR']]) &&
                expect(targetingSegments).to.eventually
                    .have.property('exclude')
                    .and.deep.equal([[1, 'OR']]);
        });

    });

});





