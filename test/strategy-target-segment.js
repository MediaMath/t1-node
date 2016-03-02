"use strict";

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

    describe("#update targeting", function () {
        parsedResult = common.loadFixture('strategy-targeting-segments');

        var targetingSegments = new t1.StrategyTargetSegments();
        targetingSegments.include = [[1, 'OR']];
        targetingSegments.exclude = [[119, 'OR']];
        targetingSegments.include_op = 'OR';
        targetingSegments.exclude_op = 'OR';


        it("should generate the correct formdata for posting", function () {

            var expected = {
                'include_op': 'OR',
                'exclude_op': 'OR',
                'segments.1.id': 1,
                'segments.1.operator': 'OR',
                'segments.1.restriction': 'INCLUDE',
                'segments.2.id': 119,
                'segments.2.operator': 'OR',
                'segments.2.restriction': 'EXCLUDE'

            };
            var formdata = targetingSegments._generateForm();

            return expect(formdata).to.eventually.deep.equal(expected);
        });
    });
});
