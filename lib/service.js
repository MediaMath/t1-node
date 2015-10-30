/// <reference path="references.ts" />
var T1Connection = require('./t1connection');
var Entity = require('./entity');
var Service = (function () {
    function Service(config) {
        this.t1connection = new T1Connection(config, console.log);
        this.entities = [];
        this.entityCount = 0;
    }

    Service.prototype.get = function (entity_name, cb) {
        var that = this;
        this.t1connection.get(entity_name, function () {
            return that.processEntityList.apply(that, arguments);
        });
    };

    Service.prototype.processEntityList = function (response, body) {
        var content = JSON.parse(body);
        var that = this;
        console.log("entities: " + this.entities);
        content.data.forEach(function(entity) {
            console.log("entity: " + entity);
            var newEntity = new Entity(entity.entity_type);
            newEntity.data.name = entity.name;
            newEntity.data.id = entity.id;
            console.log("that: " + that);
            that.entityCount = that.entities.push(newEntity);
        });
    };

    return Service;
})();

module.exports = Service;
