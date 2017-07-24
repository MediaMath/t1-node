const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();

describe('Get, and edit deals', () => {
  const t1conf = {
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    baseUrl: process.env.T1_BASEURL,
  };
  const conn = new t1.T1Connection(t1conf);
  const testTimestamp = new Date().toISOString();

  describe('#get and update single deal', function getUpdateSingle() {
    this.timeout(100000);
    const deal = new t1.Entity('deal');

    it('should get an existing deal', () => {
      const dealPromise = deal.get(process.env.TEST_DEAL_ID, conn);
      return expect(dealPromise).to.eventually
        .have.property('id', process.env.TEST_DEAL_ID);
    });

    it('should update the name', () => {
      const expectedName = `t1-node test deal${testTimestamp}`;
      deal.name = expectedName;
      const dealPromise = deal.save(conn);
      return expect(dealPromise).to.eventually
        .have.property('name', expectedName);
    });
  });
});
