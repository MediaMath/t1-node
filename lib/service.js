/// <reference path="references.ts" />
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var config = require('./config');

var Service = (function () {
    function Service(t1config) {
        this.t1connection = new T1Connection(t1config, console.log);
        this.entities = [];
        this.entityCount = 0;
    }

    // accept an object with user parameters: {'endpoint': 'campaigns', 'count':10}
    Service.prototype.get = function (userParams,  cb) {
        var that = this;
        this.t1connection.get(userParams.endpoint, function () {
            var mainArguments = Array.prototype.slice.call(arguments);
            mainArguments.push(userParams);
            mainArguments.push(cb);
            return that.processEntityList.apply(that, mainArguments);
        });
    };

    Service.prototype.processEntityList = function (response, body, userParams, cb) {
        var content = JSON.parse(body);
        var that = this;
        console.log(content);
        var nextPage = content.meta.next_page;
        for (entity of content.data) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.data.name = entity.name;
            newEntity.data.id = entity.id;
            that.entityCount = that.entities.push(newEntity);
            if (that.entityCount === userParams.count) {
                break;
            }
        }

        if (that.entityCount !== userParams.count &&
            typeof nextPage !== 'undefined') {

            //Copy params before firing off call to avoid treading on toes.
            var newParams = JSON.parse(JSON.stringify(userParams));
            newParams.endpoint = nextPage.substring(config.apiUrl.length, nextPage.length);

            // kick off an asynchronous call to grab the next page of results
            this.get(newParams, cb)
        }
        return cb(this.entities[this.entityCount - 1])
    };

    return Service;
})();

module.exports = Service;
