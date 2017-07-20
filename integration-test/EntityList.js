const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();

describe('Request an entity list and page through it', () => {
  const t1conf = {
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    client_secret: process.env.T1_SECRET,
    apiBaseUrl: process.env.T1_BASEURL,
    redirect_uri: process.env.T1_REDIRECTURL,
    advertiser_id: parseInt(process.env.T1_ADVERTISER, 10),
    // Tests will return 403 if user does not have access to advertiser
  };
  const conn = new t1.T1Connection(t1conf);


  describe('#request a list of ten campaigns', function requestTen() {
    this.timeout(10000);
    const userParams = {
      page_limit: 10,
    };
    const listPromise = t1.EntityList.get('campaigns', conn, userParams);
    it('should retrieve 10 campaigns', () => {
      return expect(listPromise).to.eventually
        .have.property('entities').to.not.be.empty;
    });
    it('should have 10 entities in meta', () => {
      return expect(listPromise).to.eventually
        .have.property('meta')
        .that.has.property('count', 10);
    });
  });
});
