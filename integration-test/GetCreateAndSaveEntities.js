var expect = require('./chai_config').expect;
var t1 = require('../index');
require('dotenv').load();


describe('Get, create and save Entities', function () {

  let t1conf = {
    preferCookieAuth: true,
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY
    // Tests will return 403 if user does not have access to advertiser
  };

  var conn = new t1.T1Connection(t1conf);
  var testTimestamp = new Date().toISOString();
  var expectedName = 't1-node test ' + testTimestamp;
  var campaignId, strategyId;

  describe('#create and update single campaign', function () {
    var campaign = new t1.Entity('campaign');

    it('should save a new campaign', function () {
      campaign.ad_server_id = 9;
      campaign.name = expectedName + ' campaign';
      campaign.advertiser_id = parseInt(process.env.T1_ADVERTISER);
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

    it('should update name', function () {
      campaignId = campaign.id;
      var expectedName = campaign.name + '_UPDATED';
      var version = campaign.version;
      campaign.name = expectedName;
      var campaignPromise = campaign.save(conn);

      return expect(campaignPromise).to.eventually
        .have.property('name', expectedName) &&
        expect(campaignPromise).to.eventually
          .have.property('version', version + 1);
    });
  });

  describe('#create a strategy', function () {
    var strategy = new t1.Entity('strategy');

    it('should save a new strategy', function () {
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

    it('set the strategy ID', function () {
      strategyId = strategy.id;
    });
  });

  describe('#set up target segments', function () {
    this.timeout(10000);
    var targetSegments = new t1.StrategyTargetSegments();

    it('should get the target segments', function () {
      var targetSegmentsPromise = targetSegments.get(strategyId, conn);
      return expect(targetSegmentsPromise).to.eventually
        .have.property('include_op', 'OR') &&
        expect(targetSegmentsPromise).to.eventually
          .have.property('exclude_op', 'OR') &&
        expect(targetSegmentsPromise).to.eventually
          .have.property('include')
          .and.deep.equal([]) &&
        expect(targetSegmentsPromise).to.eventually
          .have.property('exclude')
          .and.deep.equal([]);
    });

    it('should get a CPM', function () {
      targetSegments.include = [
        [865, 'OR'],
        [871, 'OR']
      ];
      targetSegments.exclude = [
        [362, 'OR']
      ];

      var cpmPromise = targetSegments.getCpmEstimate(conn);

      return expect(cpmPromise).to.eventually
        .have.property('price_estimate')
        .and.have.property('amount');
    });


    it('should successfully save', function () {
      var savePromise = targetSegments.save(conn);

      return expect(savePromise).to.be.fulfilled;
    });
  });

  describe('#set up audience segments', function () {
    this.timeout(10000);
    var audienceSegments = new t1.StrategyAudienceSegments();

    it('should get the target segments', function () {
      var audienceSegmentsPromise = audienceSegments.get(strategyId, conn);
      return expect(audienceSegmentsPromise).to.eventually
        .have.property('include_op', 'OR') &&
        expect(audienceSegmentsPromise).to.eventually
          .have.property('exclude_op', 'OR') &&
        expect(audienceSegmentsPromise).to.eventually
          .have.property('include')
          .and.deep.equal([]) &&
        expect(audienceSegmentsPromise).to.eventually
          .have.property('exclude')
          .and.deep.equal([]);
    });

    it('should get a CPM', function () {
      audienceSegments.include = [131454, 131453];
      audienceSegments.exclude = [131452];

      var cpmPromise = audienceSegments.getCpmEstimate(conn);

      return expect(cpmPromise).to.eventually
        .have.property('price_estimate')
        .and.have.property('amount');
    });


    it('should successfully save', function () {
      var savePromise = audienceSegments.save(conn);

      return expect(savePromise).to.be.fulfilled;
    });
  });

  describe('#set up target dimensions', function () {
    this.timeout(10000);
    var targetValues = new t1.StrategyTargetValues();

    it('should get the target values', function () {
      var targetValuesPromise = targetValues.get(strategyId, conn);
      return expect(targetValuesPromise).to.eventually
        .have.property('dimensions')
        .and.deep.equal([]);
    });

    it('should successfully save', function () {
      targetValues.addTargetValues('REGN', 'INCLUDE', 'OR', [23, 251]);
      it('should successfully save', function () {

        var savePromise = targetValues.save(conn);
        return expect(savePromise).to.eventually
          .have.property('price_estimate')
          .and.have.property('amount');
      });

    });
  });
});
