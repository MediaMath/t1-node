const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();

describe('Get, and edit deals', () => {
  const t1conf = {
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    client_secret: process.env.T1_SECRET,
    apiBaseUrl: process.env.T1_BASEURL,
    redirect_uri: process.env.T1_REDIRECTURL,
    advertiser_id: parseInt(process.env.T1_ADVERTISER),
    // Tests will return 403 if user does not have access to advertiser
  };
  const conn = new t1.T1Connection(t1conf);
  const testTimestamp = new Date().toISOString();

  describe('#get and update single deal', function () {
    this.timeout(100000);
    const deal = new t1.Entity('deal');

    it('should get an existing deal', () => {
      const dealPromise = deal.get(195324, conn);
      return expect(dealPromise).to.eventually
        .have.property('id', 195324);
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
