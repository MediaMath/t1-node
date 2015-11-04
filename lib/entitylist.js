var Q = require('q');
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');

var EntityList = (function () {
    function EntityList(t1config) {
        this.t1connection = new T1Connection(t1config);

    }

    // accept an object with user parameters: {'page_limit':10}
    EntityList.prototype.get = function (baseUrl, userParams) {
        var that = this;
        var queryString = this.buildQueryString(baseUrl, userParams);
        return this.t1connection.get(queryString)
            .then(function (body) {
                return that.processEntityList(body);
            })
    };

    EntityList.prototype.processEntityList = function (body) {
        var result = {};
        result.entities = [];

        var content = JSON.parse(body);
        result.next_page = content.meta.next_page;
        for (entity of content.data) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.data.name = entity.name;
            newEntity.data.id = entity.id;
            result.entityCount = result.entities.push(newEntity);
        }

        return result;
    };

    EntityList.prototype.getNextPage = function (entities) {
        if (typeof entities.next_page !== 'undefined') {

            var nextPage = entities.next_page.substring(config.apiUrl.length, entities.next_page.length);

            return this.get(nextPage)
        }
    };

    EntityList.prototype.buildQueryString = function (baseUrl, userParams) {

        var endpoint = baseUrl;
        if (userParams) {
            var str = [];
            for (var p in userParams)
                if (userParams.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(userParams[p]));
                }
            if (Object.keys(userParams).length > 0) {
                endpoint += '?' + str.join("&");

            }
        }

        return endpoint;
    };

    return EntityList;
})();

module.exports = EntityList;
