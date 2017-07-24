const expect = require('./chai_config').expect;
const t1 = require('../index');
require('dotenv').load();

describe('Request an entity list and page through it', () => {
  const t1conf = {
    user: process.env.T1_API_USERNAME,
    password: process.env.T1_API_PASSWORD,
    api_key: process.env.T1_API_KEY,
    baseUrl: process.env.T1_BASEURL,
  };
  const conn = new t1.T1Connection(t1conf);


  describe('#request a list of ten campaigns', function requestTen() {
    this.timeout(10000);
    const userParams = {
      page_limit: 10,
    };
    const listPromise = t1.EntityList.get('campaigns', conn, userParams);
    it('should retrieve 10 campaigns', () => listPromise.then((list) => {
      const entities = [];
      for (const entity of list.entities) {
        entities.push(entity);
      }
      expect(entities).to.have.lengthOf(10);
      expect(entities[0]).to.have.property('name');
      expect(entities[0]).to.have.property('id');
    }));
    it('should have 10 entities in meta', () => expect(listPromise).to.eventually
        .have.property('meta')
        .that.has.property('count', 10));
  });
});
