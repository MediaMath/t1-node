/// <reference path="references.ts" />
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var api_url = "https://api.mediamath.com/api/v2.0/";

var Service = (function () {
    function Service(config) {
        this.t1connection = new T1Connection(config, console.log);
        this.entities = [];
        this.entityCount = 0;
    }

    Service.prototype.get = function (entity_name, cb) {
        var that = this;
        this.t1connection.get(entity_name, function () {
            var mainArguments = Array.prototype.slice.call(arguments);
            mainArguments.push(cb)
            return that.processEntityList.apply(that, mainArguments);
        });
    };

    Service.prototype.processEntityList = function (response, body, cb) {
        var content = JSON.parse(body);
        var that = this;
        var nextPage = content.meta.next_page;
        content.data.forEach(function(entity) {
            var newEntity = new Entity(entity.entity_type);
            newEntity.data.name = entity.name;
            newEntity.data.id = entity.id;
            that.entityCount = that.entities.push(newEntity);
        });

        if (typeof nextPage != 'undefined') {
            nextPage = nextPage.substring(api_url.length, nextPage.length);
            this.get(nextPage, cb)
        }
        return cb(this.entities[this.entityCount - 1])
    };

    return Service;
})();

module.exports = Service;
