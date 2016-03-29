var BPromise = require('bluebird');
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

    describe("#get single campaign", function () {
        parsedResult = common.loadFixture('campaign');

        var campaign = new t1.Entity('campaign');

        it("should have a populated campaign entity", function () {
            campaign = campaign.get(10000, connectionStub);

            return expect(campaign).to.eventually
                    .have.property('id', 10000) &&
                expect(campaign).to.eventually
                    .have.property('entity_type', 'campaign');
        });

    });

    describe("#get/set currency values", function () {
        var campaignData = JSON.parse(common.loadFixture('campaign'));

        var campaign = new t1.Entity('campaign');

        campaign.processEntity(campaignData.data, campaignData.meta);

        it("should return the default currency value", function () {
            var amt = campaign.getCurrencyValue('goal_value');

            return expect(amt).to.equal(campaign.goal_value[0].value);

        });

        it("should return the JPY currency value", function () {
            var amt = campaign.getCurrencyValue('goal_value',  'JPY');
            return expect(amt).to.equal(campaign.goal_value[1].value);
        });

        it("should set the default currency value", function () {
            var newValue = 1;
            campaign.setCurrencyValue('goal_value', newValue);
            var changedAmt = campaign.getCurrencyValue('goal_value');
            return expect(changedAmt).to.equal(newValue);

        });

        it("should set the JPY currency value", function () {
            var newValue = 2;
            campaign.setCurrencyValue('goal_value', newValue, 'JPY');
            var changedAmt = campaign.getCurrencyValue('goal_value', 'JPY');
            return expect(changedAmt).to.equal(newValue);

        });
    });

    describe("#generate post data", function () {
        var campaignData = JSON.parse(common.loadFixture('campaign'));

        var campaign = new t1.Entity('campaign');

        campaign.processEntity(campaignData.data, campaignData.meta);

        it("should flatten currency data", function () {
            var amt = campaign.getCurrencyValue('goal_value');
            var form = campaign._getPostData();

            return expect(form).to.eventually
                .have.property('goal_value', amt);
        });

    });

});





