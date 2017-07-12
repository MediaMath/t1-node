'use strict';
var expect = require('./chai_config').expect;
var sinon = require('sinon');
var common = require('./test-common');
var t1 = require('../index');

describe('entityList', function () {

  var service = t1.EntityList;

  var t1config = {};

  class ConnectionStub {

    get() {
    }

    post() {
      return '';
    }

    buildQueryString(base, userParams) {
      var t1Connection = new t1.T1Connection(t1config);
      return t1Connection.buildQueryString(base, userParams);
    }
  }

  describe('#get with count', function () {
    var userParams = {'page_limit': 10};

    it('should have 10 entities', function () {
      let parsedResult = common.loadFixture('campaigns-10');


      let conn = new ConnectionStub();

      sinon.stub(conn, 'get')
        .resolves(parsedResult);

      return service.get('campaigns', conn, userParams).then(function (data) {
        expect(data).to.have.property('meta')
          .and.have.property('count', userParams.page_limit);
        expect(conn.get.called).to.equal(true);
        expect(conn.get.getCall(0).args[0]).equal('/api/v2.0/campaigns?page_limit=10&api_key=noapikey');
      });
    });
  });


  describe('#get next page', function () {
    let userParams = {};

    it('should have request the correct next page of entities', function () {
      let parsedResult = common.loadFixture('campaigns-100');

      let conn = new ConnectionStub();

      sinon.stub(conn, 'get')
        .resolves(parsedResult);

      return service.get('campaigns', conn, userParams).then(function (page1) {
        return service.getNextPage(page1, conn);
      }).then(function () {
        expect(conn.get.callCount).to.equal(2);
        expect(conn.get.getCall(1).args[0]).equal('https://api.mediamath.com/api/v2.0/campaigns?page_offset=100&api_key=noapikey');
      });
    });
  });
});
