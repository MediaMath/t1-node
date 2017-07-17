const BPromise = require('bluebird');
const expect = require('./chai_config').expect;
const sinon = require('sinon');
const t1 = require('../index');
const common = require('./test-common.js');

describe('entity', () => {
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

  describe('#get single campaign', () => {
    parsedResult = common.loadFixture('campaign');

    let campaign = new t1.Entity('campaign');

    it('should have a populated campaign entity', () => {
      campaign = campaign.get(10000, connectionStub);

      return expect(campaign).to.eventually
        .have.property('id', 10000) &&
        expect(campaign).to.eventually
          .have.property('entity_type', 'campaign');
    });
  });

  describe('#get/set currency values', () => {
    const campaignData = JSON.parse(common.loadFixture('campaign'));

    const campaign = new t1.Entity('campaign');

    campaign.processEntity(campaignData.data, campaignData.meta);

    it('should return the default currency value', () => {
      const amt = campaign.getCurrencyValue('goal_value');

      return expect(amt).to.equal(campaign.goal_value[0].value);
    });

    it('should return the JPY currency value', () => {
      const amt = campaign.getCurrencyValue('goal_value', 'JPY');
      return expect(amt).to.equal(campaign.goal_value[1].value);
    });

    it('should set the default currency value', () => {
      const newValue = 1;
      campaign.setCurrencyValue('goal_value', newValue);
      const changedAmt = campaign.getCurrencyValue('goal_value');
      return expect(changedAmt).to.equal(newValue);
    });

    it('should set the JPY currency value', () => {
      const newValue = 2;
      campaign.setCurrencyValue('goal_value', newValue, 'JPY');
      const changedAmt = campaign.getCurrencyValue('goal_value', 'JPY');
      return expect(changedAmt).to.equal(newValue);
    });

    it('should set a default currency value of a nonexistant field', () => {
      const newValue = 1;
      campaign.setCurrencyValue('some_new_value', newValue);
      const changedAmt = campaign.getCurrencyValue('some_new_value');
      return expect(changedAmt).to.equal(newValue);
    });
  });

  describe('#generate post data', () => {
    const campaignData = JSON.parse(common.loadFixture('campaign'));

    const campaign = new t1.Entity('campaign');

    campaign.processEntity(campaignData.data, campaignData.meta);

    it('should flatten currency data', () => {
      const amt = campaign.getCurrencyValue('goal_value');
      const form = campaign.getPostFormData();

      return expect(form).to.eventually
        .have.property('goal_value', amt);
    });
  });
});

