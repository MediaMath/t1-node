var expect = require('./chai_config').expect;
var t1 = require('../index');

describe("Get, create and save Entities", function () {

    t1conf = {
        user: process.env.T1SANDBOX_API_USERNAME,
        password: process.env.T1SANDBOX_API_PASSWORD,
        api_key: process.env.T1SANDBOX_API_KEY,
        apiUrl: 'https://t1sandbox.mediamath.com/api/v2.0/'
    };

    var conn = new t1.T1Connection(t1conf);
    var testTimestamp = new Date().toISOString();
    var expectedName = "t1-node test " + testTimestamp;
    var campaignId;

    describe("#create and update single campaign", function () {
        var campaign = new t1.Entity('campaign');

        it("should save a new campaign", function () {
            campaign.ad_server_id = 9;
            campaign.name = expectedName + ' campaign';
            campaign.advertiser_id = 154359;
            campaign.status = false;
            var start = new Date(),
                end = new Date();
            start.setDate(start.getDate() + 1);
            end.setDate(start.getDate() + 7);
            campaign.start_date = start.toISOString();
            campaign.end_date = end.toISOString();
            campaign.goal_type = 'cpc';
            campaign.setCurrencyValue('goal_value', 100);
            campaign.service_type = 'SELF';
            campaign.setCurrencyValue('total_budget', 100);
            campaign.use_mm_freq = false;
            
            var campaignPromise = campaign.save(conn);
            
            return expect(campaignPromise).to.eventually
                    .have.property('id') &&
                expect(campaignPromise).to.eventually
                    .have.property('version', 0);
        });

        it("should update name", function() {
            campaignId = campaign.id;
            var expectedName = campaign.name + '_UPDATED';
            var version = campaign.version;
            campaign.name = expectedName;
            var campaignPromise = campaign.save(conn);

            return expect(campaignPromise).to.eventually
                    .have.property('name', expectedName) &&
                expect(campaignPromise).to.eventually
                    .have.property('version', version + 1 );
        });
    });

    describe("#create a strategy", function () {
        var strategy = new t1.Entity('strategy');

        it("should save a new strategy", function () {
            strategy.name = expectedName + ' strategy';
            strategy.budget = 100;
            strategy.campaign_id = campaignId;
            strategy.status = false;
          
            strategy.use_campaign_start = true;
            strategy.use_campaign_end = true;
            strategy.goal_type = 'spend';
            strategy.setCurrencyValue('goal_value', 100);
            strategy.setCurrencyValue('max_bid', 2);
            strategy.setCurrencyValue('pacing_amount', 2);
            strategy.type = 'GBO';

            var strategyPromise = strategy.save(conn);

            return expect(strategyPromise).to.eventually
                    .have.property('id') &&
                expect(strategyPromise).to.eventually
                    .have.property('version', 0);
        });
    });
});
