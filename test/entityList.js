
const expect = require('./chai_config').expect;
const sinon = require('sinon');
const common = require('./test-common');
const t1 = require('../index');

describe('entityList', () => {
  const service = t1.EntityList;

  const t1config = {};

  class ConnectionStub {

    get() {
    }

    post() {
      return '';
    }

    buildQueryString(base, userParams) {
      const t1Connection = new t1.T1Connection(t1config);
      return t1Connection.buildQueryString(base, userParams);
    }
  }

  describe('#get with count', () => {
    const userParams = { page_limit: 10 };

    it('should have 10 entities', () => {
      const parsedResult = common.loadFixture('campaigns-10');


      const conn = new ConnectionStub();

      sinon.stub(conn, 'get')
        .resolves(parsedResult);

      return service.get('campaigns', conn, userParams).then((data) => {
        expect(data).to.have.property('meta')
          .and.have.property('count', userParams.page_limit);
        expect(conn.get.called).to.equal(true);
        expect(conn.get.getCall(0).args[0]).equal('/api/v2.0/campaigns?page_limit=10&api_key=noapikey');
      });
    });
  });


  describe('#get next page', () => {
    const userParams = {};

    it('should have request the correct next page of entities', () => {
      const parsedResult = common.loadFixture('campaigns-100');

      const conn = new ConnectionStub();

      sinon.stub(conn, 'get')
        .resolves(parsedResult);

      return service.get('campaigns', conn, userParams).then(page1 => service.getNextPage(page1, conn)).then(() => {
        expect(conn.get.callCount).to.equal(2);
        expect(conn.get.getCall(1).args[0]).equal('https://api.mediamath.com/api/v2.0/campaigns?page_offset=100&api_key=noapikey');
      });
    });
  });
});
