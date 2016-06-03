var BPromise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var t1 = require('../index');
var common = require('./test-common');

describe("strategy target values", function () {

    var connectionStub = {};
    connectionStub.get = function () {
    };
    connectionStub.post = function () {
    };
    var sandbox, getStub, postStub;
    var parsedResult = "aisdaiusd";

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        getStub = sandbox.stub(connectionStub, "get").returns(BPromise.try(function () {
            return parsedResult;
        }));
        postStub = sandbox.stub(connectionStub, "post").returns(BPromise.try(function () {
            return parsedResult;
        }));
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe("#get strategy target values", function () {
        parsedResult = common.loadFixture('strategy-target-values');
        var targetingSegments = new t1.StrategyTargetValues();
        it("should have strategy target dimensions and values", function () {
            targetingSegments = targetingSegments.get(123456, connectionStub);

            var expectedDimensions = [
                {
                    code: "REGN",
                    operation: "OR",
                    restriction: "INCLUDE",
                    value_ids: [251, 23]
                },
                {
                    code: "REGN",
                    operation: "OR",
                    restriction: "EXCLUDE",
                    value_ids: [31]
                },
                {
                    code: "DMAX",
                    operation: "OR",
                    restriction: "INCLUDE",
                    value_ids: [99846]
                }];

            return expect(targetingSegments).to.eventually
                    .have.property('strategy_id', 123456) &&
                expect(targetingSegments).to.eventually
                    .have.property('dimensions')
                    .and.deep.equal(expectedDimensions);
        });
    });

    describe("#update targeting", function () {
        var targetingDimensions = new t1.StrategyTargetValues();
        targetingDimensions.addTargetValues('REGN', 'INCLUDE', 'OR', [23, 251]);
        targetingDimensions.addTargetValues('REGN', 'EXCLUDE', 'OR', [31]);
        targetingDimensions.addTargetValues('DMAX', 'INCLUDE', 'OR', [99846]);

        it("should generate the correct formdata for posting", function () {

            var expected = {
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
                'dimensions.3.value_ids': '99846'
            };
            var formdata = targetingDimensions._generateForm();

            return expect(formdata).to.eventually.deep.equal(expected);
        });
    });
});
