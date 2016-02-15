var Promise = require('bluebird');
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var t1 = require('../index');
var common = require('./test-common.js');

describe("entity", function () {

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

    describe("#get single campaign", function () {
        parsedResult = common.loadFixture('campaign');

        var campaign = new t1.Entity('campaign');

        it("should have a populated campaign entity", function () {
            campaign = campaign.get(10000, connectionStub);

            return expect(campaign).to.eventually
                    .have.deep.property('data.id', 10000) &&
                expect(campaign).to.eventually
                    .have.deep.property('data.entity_type', 'campaign')
        });

    });

});





