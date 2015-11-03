var Q = require('q');
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');

var EntityList = (function () {
    function EntityList(t1config) {
        this.t1connection = new T1Connection(t1config, console.log);
        this.entities = [];
        this.entityCount = 0;
        this.next_page = null;
    }

    // accept an object with user parameters: {'page_limit':10}
    EntityList.prototype.get = function (baseUrl, userParams) {
        var that = this;
        var queryString = this.buildQueryString(baseUrl, userParams);
        console.log('getting: ' + queryString);
        return this.t1connection.get(queryString)
            .then(function () {
                that.processEntityList.apply(that, arguments);
                return Q.resolve({
                    then: function (onFulfill, onReject) {
                        onFulfill(that);
                    }
                })
            });
    };

    EntityList.prototype.processEntityList = function (body) {
        var content = JSON.parse(body);
        var that = this;
        that.next_page = content.meta.next_page;
        for (entity of content.data) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.data.name = entity.name;
            newEntity.data.id = entity.id;
            that.entityCount = that.entities.push(newEntity);
        }
    };

    EntityList.prototype.getNextPage = function () {
        if (typeof this.next_page !== 'undefined') {

            var nextPage = this.next_page.substring(config.apiUrl.length, this.next_page.length);

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
