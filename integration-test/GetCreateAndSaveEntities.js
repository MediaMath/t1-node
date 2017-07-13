const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();


describe('Get, create and save Entities', () => {
  const t1conf = {
    preferCookieAuth: true,
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    // Tests will return 403 if user does not have access to advertiser
  };

  const conn = new t1.T1Connection(t1conf);
  const testTimestamp = new Date().toISOString();
  const expectedName = `t1-node test ${testTimestamp}`;
  let campaignId,
    strategyId;

  describe('#create and update single campaign', () => {
    const campaign = new t1.Entity('campaign');

    it('should save a new campaign', () => {
      campaign.ad_server_id = 9;
      campaign.name = `${expectedName} campaign`;
      campaign.advertiser_id = parseInt(process.env.T1_ADVERTISER);
      campaign.status = false;
      let start = new Date(),
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

      const campaignPromise = campaign.save(conn);

      return expect(campaignPromise).to.eventually
        .have.property('id') &&
        expect(campaignPromise).to.eventually
          .have.property('version', 0);
    });

    it('should update name', () => {
      campaignId = campaign.id;
      const expectedName = `${campaign.name}_UPDATED`;
      const version = campaign.version;
      campaign.name = expectedName;
      const campaignPromise = campaign.save(conn);

      return expect(campaignPromise).to.eventually
        .have.property('name', expectedName) &&
        expect(campaignPromise).to.eventually
          .have.property('version', version + 1);
    });
  });

  describe('#create a strategy', () => {
    const strategy = new t1.Entity('strategy');

    it('should save a new strategy', () => {
      strategy.name = `${expectedName} strategy`;
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

      const strategyPromise = strategy.save(conn);

      return expect(strategyPromise).to.eventually
        .have.property('id') &&
        expect(strategyPromise).to.eventually
          .have.property('version', 0);
    });

    it('set the strategy ID', () => {
      strategyId = strategy.id;
    });
  });

  describe('#set up target segments', function () {
    this.timeout(10000);
    const targetSegments = new t1.StrategyTargetSegments();

    it('should get the target segments', () => {
      const targetSegmentsPromise = targetSegments.get(strategyId, conn);
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

    it('should get a CPM', () => {
      targetSegments.include = [
        [865, 'OR'],
        [871, 'OR'],
      ];
      targetSegments.exclude = [
        [362, 'OR'],
      ];

      const cpmPromise = targetSegments.getCpmEstimate(conn);

      return expect(cpmPromise).to.eventually
        .have.property('price_estimate')
        .and.have.property('amount');
    });


    it('should successfully save', () => {
      const savePromise = targetSegments.save(conn);

      return expect(savePromise).to.be.fulfilled;
    });
  });

  describe('#set up audience segments', function () {
    this.timeout(10000);
    const audienceSegments = new t1.StrategyAudienceSegments();

    it('should get the target segments', () => {
      const audienceSegmentsPromise = audienceSegments.get(strategyId, conn);
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

    it('should get a CPM', () => {
      audienceSegments.include = [131454, 131453];
      audienceSegments.exclude = [131452];

      const cpmPromise = audienceSegments.getCpmEstimate(conn);

      return expect(cpmPromise).to.eventually
        .have.property('price_estimate')
        .and.have.property('amount');
    });


    it('should successfully save', () => {
      const savePromise = audienceSegments.save(conn);

      return expect(savePromise).to.be.fulfilled;
    });
  });

  describe('#set up target dimensions', function () {
    this.timeout(10000);
    const targetValues = new t1.StrategyTargetValues();

    it('should get the target values', () => {
      const targetValuesPromise = targetValues.get(strategyId, conn);
      return expect(targetValuesPromise).to.eventually
        .have.property('dimensions')
        .and.deep.equal([]);
    });

    it('should successfully save', () => {
      targetValues.addTargetValues('REGN', 'INCLUDE', 'OR', [23, 251]);
      it('should successfully save', () => {
        const savePromise = targetValues.save(conn);
        return expect(savePromise).to.eventually
          .have.property('price_estimate')
          .and.have.property('amount');
      });
    });
  });
});
