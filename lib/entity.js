'use strict';
let EntityMap = require('./entitymap');
let SchemaProcessing = require('./schemaprocessing');
require('dotenv').load();

let Entity = function (type, connection, id) {
  this.entity_type = type;

  if (id && connection) {
    this.get(id, connection);
  }
};

Entity.prototype.get = function (id, connection, userParams) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }
  let that = this;
  return SchemaProcessing.getSchema('userparams')
    .then(function (schema) {
      let verification = SchemaProcessing.validateJson(userParams, schema);
      if (verification.length !== 0) {
        // you may want to specify a custom error type here, and set the verification
        // results as a property of them.
        throw new Error(verification);
      }
      let queryString = connection.buildQueryString(EntityMap.getEndpoint(that.entity_type) + '/' + id, userParams);
      return connection.get(queryString);
    }).then(function (body) {
      let content = JSON.parse(body);
      return that.processEntity(content.data, content.meta);
    });
};


// called on successful save of entity
Entity.prototype.processEntity = function (data, meta) {
  for (let property in data) {
    if (!data.hasOwnProperty(property) || !data[property]) {
      continue;
    }
    if (data[property].constructor === Array &&
            data[property][0].hasOwnProperty('entity_type')) {
      let EntityList = require('./entitylist');
      data[property] = EntityList.processEntityList(data[property], {});
    }
    else if (data[property].constructor === Object &&
            data[property].hasOwnProperty('entity_type')) {
      let related = new Entity(data[property].entity_type);
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
  let that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then(function (schema) {
      let verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      }
      else {
        let endpoint = EntityMap.getEndpoint(that.entity_type);
        let postFormat = EntityMap.getPostFormat(that.entity_type);


        if (typeof that.id !== 'undefined') {
          endpoint += '/' + that.id;
        }
        if (postFormat === 'json') {
          return that._saveJson(endpoint, connection);
        }
        else if (postFormat === 'formdata') {
          return that._saveFormData(endpoint, connection);
        }

      }
    });
};

Entity.prototype.getCurrencyValue = function (fieldName, currencyName) {
  return _getOrSetCurrencyValue(this, fieldName, currencyName);
};

Entity.prototype.setCurrencyValue = function (fieldName, amount, currencyName) {
  return _getOrSetCurrencyValue(this, fieldName, currencyName, amount);
};

Entity.prototype._saveJson = function (endpoint, connection) {
  let data = this._getJsonData();
  let that = this;
  return connection.postJson(endpoint, data).then(function (body) {
    let content = JSON.parse(body);
    return that.processEntity(content.data, content.meta);
  });

};

Entity.prototype._saveFormData = function (endpoint, connection) {
  let that = this;
  return that._getPostFormData()
    .then(function (form) {
      let endpoint = EntityMap.getEndpoint(that.entity_type);
      if (typeof that.id !== 'undefined') {
        endpoint += '/' + that.id;
      }
      return connection.postFormdata(endpoint, form).then(function (body) {
        let content = JSON.parse(body);
        return that.processEntity(content.data, content.meta);
      });
    });

};

Entity.prototype._getJsonData = function () {

  let data = JSON.parse(JSON.stringify(this));

  //remove any null properties; the API doesn't support them.
  for (let property in this) {
    if (this.hasOwnProperty(property) && !this[property]) {
      delete data[property];
    }
  }
  return JSON.stringify(data);
};

Entity.prototype._getPostFormData = function () {
  let that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then(function (schema) {
      let schemaAllOf = schema.allOf;
      let encodeForPost = function (key, value) {
        if (typeof value === 'boolean') {
          return Number(value);
        }
        else if (typeof value === 'function') {
          return undefined;
        }
        return value;
      };

      let form = JSON.parse(JSON.stringify(that, encodeForPost));
      schemaAllOf.map(function (schema) {
        Object.keys(schema.properties).forEach(function (key) {
          if (schema.properties[key].readonly) {
            delete form[key];
          }
        });
      });

      //flatten the currency elements
      for (let property in form) {
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
    currencyName = obj.currency_code || (process.env.CURRENCY_CODE || 'USD');
  }
  if (!obj[fieldName]) {
    obj[fieldName] = [];
  }
  let currencyValues = obj[fieldName];
  for (let currencyPair of currencyValues) {
    if (currencyPair.currency_code === currencyName) {
      if (setAmount) {
        currencyPair.value = setAmount;
      }
      return currencyPair.value;
    }
  }
  // if we are here it means it's not in the list
  if (setAmount) {
    let newEntry = {
      currency_code: currencyName,
      value: setAmount
    };
    currencyValues.push(newEntry);
    return newEntry.value;
  }
}


module.exports = Entity;
