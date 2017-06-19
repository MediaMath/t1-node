"use strict";

var EntityMap = require('./entitymap');
var SchemaProcessing = require('./schemaprocessing');
var Config = require('./common/config');
var BPromise = require('bluebird');

var Entity = function (type, connection, id) {
    this.entity_type = type;

    if (id && connection) {
        this.get(id, connection);
    }
};

Entity.prototype.get = function (id, connection, userParams) {
    if (!connection) {
        throw new Error("connection object must be provided");
    }
    var that = this;
    return SchemaProcessing.getSchema('userparams')
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(userParams, schema);
            if (verification.length !== 0) {
                // you may want to specify a custom error type here, and set the verification
                // results as a property of them.
                throw new Error(verification);
            }
            var queryString = connection.buildQueryString(EntityMap.getEndpoint(that.entity_type) + "/" + id, userParams);
            return connection.get(queryString);
        }).then(function (body) {
            var content = JSON.parse(body);
            return that.processEntity(content.data, content.meta);
        });
};


// called on successful save of entity
Entity.prototype.processEntity = function (data, meta) {
    for (var property in data) {
        if (!data.hasOwnProperty(property)) {
            continue;
        }
        if (data[property].constructor === Array &&
            data[property][0].hasOwnProperty('entity_type')) {
            var EntityList = require('./entitylist');
            data[property] = EntityList.processEntityList(data[property], {});
        }
        else if (data[property].constructor === Object &&
            data[property].hasOwnProperty('entity_type')) {
            var related = new Entity(data[property].entity_type);
            related.processEntity(data[property], {});
            data[property] = related;
        }
    }

    if (meta !== undefined) {
        data.meta = meta;
    }

    Object.assign(this, data);
    return this;
};

Entity.prototype.save = function (connection) {
    var that = this;
    return SchemaProcessing.getSchema(that.entity_type)
        .then(function (schema) {
            var verification = SchemaProcessing.validateJson(that, schema);
            if (verification.length !== 0) {
                throw new Error(verification);
            }
            else {
                return that._getPostData()
                    .then(function (form) {
                        var endpoint = EntityMap.getEndpoint(that.entity_type);
                        if (typeof that.id != 'undefined') {
                            endpoint += "/" + that.id;
                        }
                        return connection.postFormdata(endpoint, form).then(function (body) {
                            var content = JSON.parse(body);
                            return that.processEntity(content.data, content.meta);
                        });
                    });
            }
        });
};

Entity.prototype.getCurrencyValue = function (fieldName, currencyName) {
    return _getOrSetCurrencyValue(this, fieldName, currencyName);
};

Entity.prototype.setCurrencyValue = function (fieldName, amount, currencyName) {
    return _getOrSetCurrencyValue(this, fieldName, currencyName, amount);
};

Entity.prototype._getPostData = function () {
    var postFormat = EntityMap.getPostFormat(this.entity_type);
    var that = this;
    return BPromise.try(function () {
        if (postFormat === 'json') {
            return that._getPostJson()
        }
        else if (postFormat === 'formdata') {
            return that._getPostFormData();
        }
    });
};

Entity.prototype._getPostJson = function () {
    return json.stringify(this);
};

Entity.prototype._getPostFormData = function () {
    var that = this;
    return SchemaProcessing.getSchema(that.entity_type)
        .then(function (schema) {
            var schemaAllOf = schema.allOf;
            var encodeForPost = function (key, value) {
                if (typeof value === "boolean") {
                    return Number(value);
                }
                else if (typeof value === "function") {
                    return undefined;
                }
                return value;
            };

            var form = JSON.parse(JSON.stringify(that, encodeForPost));
            schemaAllOf.map(function (schema) {
                Object.keys(schema.properties).forEach(function (key) {
                    if (schema.properties[key].readonly) {
                        delete form[key];
                    }
                });
            });

            //flatten the currency elements
            for (var property in form) {
                if (!form.hasOwnProperty(property)) {
                    continue;
                }
                if (form[property].constructor === Array &&
                    form[property][0].hasOwnProperty('currency_code')) {
                    form[property] = that.getCurrencyValue(property);
                }
            }
            return form;
        });
};

function _getOrSetCurrencyValue(obj, fieldName, currencyName, setAmount) {
    if (!currencyName) {
        currencyName = obj.currency_code || Config.defaultCurrencyCode;
    }
    if (!obj[fieldName]) {
        obj[fieldName] = [];
    }
    var currencyValues = obj[fieldName];
    for (var currencyPair of currencyValues) {
        if (currencyPair.currency_code == currencyName) {
            if (setAmount) {
                currencyPair.value = setAmount;
            }
            return currencyPair.value;
        }
    }
    // if we are here it means it's not in the list
    if (setAmount) {
        var newEntry = {
            currency_code: currencyName,
            value: setAmount
        };
        currencyValues.push(newEntry);
        return newEntry.value;
    }
}


module.exports = Entity;
