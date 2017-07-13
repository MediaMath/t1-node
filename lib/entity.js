
const EntityMap = require('./entitymap');
const SchemaProcessing = require('./schemaprocessing');
require('dotenv').load();

const Entity = function (type, connection, id) {
  this.entity_type = type;

  if (id && connection) {
    this.get(id, connection);
  }
};

Entity.prototype.get = function (id, connection, userParams) {
  if (!connection) {
    throw new Error('connection object must be provided');
  }
  const that = this;
  return SchemaProcessing.getSchema('userparams')
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(userParams, schema);
      if (verification.length !== 0) {
        // you may want to specify a custom error type here, and set the verification
        // results as a property of them.
        throw new Error(verification);
      }
      const queryString = connection.buildQueryString(`${EntityMap.getEndpoint(that.entity_type)}/${id}`, userParams);
      return connection.get(queryString);
    }).then((body) => {
      const content = JSON.parse(body);
      return that.processEntity(content.data, content.meta);
    });
};


// called on successful save of entity
Entity.prototype.processEntity = function (data, meta) {
  for (const property in data) {
    if (!data.hasOwnProperty(property) || !data[property]) {
      continue;
    }
    if (data[property].constructor === Array &&
            data[property][0].hasOwnProperty('entity_type')) {
      const EntityList = require('./entitylist');
      data[property] = EntityList.processEntityList(data[property], {});
    } else if (data[property].constructor === Object &&
            data[property].hasOwnProperty('entity_type')) {
      const related = new Entity(data[property].entity_type);
      related.processEntity(data[property], {});
      data[property] = related;
    }
  }

  if (!meta) {
    data.meta = meta;
  }

  Object.assign(this, data);
  return this;
};

Entity.prototype.save = function (connection) {
  const that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then((schema) => {
      const verification = SchemaProcessing.validateJson(that, schema);
      if (verification.length !== 0) {
        throw new Error(verification);
      } else {
        let endpoint = EntityMap.getEndpoint(that.entity_type);
        const postFormat = EntityMap.getPostFormat(that.entity_type);


        if (typeof that.id !== 'undefined') {
          endpoint += `/${that.id}`;
        }
        if (postFormat === 'json') {
          return that._saveJson(endpoint, connection);
        } else if (postFormat === 'formdata') {
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
  const data = this._getJsonData();
  const that = this;
  return connection.postJson(endpoint, data).then((body) => {
    const content = JSON.parse(body);
    return that.processEntity(content.data, content.meta);
  });
};

Entity.prototype._saveFormData = function (endpoint, connection) {
  const that = this;
  return that._getPostFormData()
    .then((form) => {
      let endpoint = EntityMap.getEndpoint(that.entity_type);
      if (typeof that.id !== 'undefined') {
        endpoint += `/${that.id}`;
      }
      return connection.postFormdata(endpoint, form).then((body) => {
        const content = JSON.parse(body);
        return that.processEntity(content.data, content.meta);
      });
    });
};

Entity.prototype._getJsonData = function () {
  const data = JSON.parse(JSON.stringify(this));

  // remove any null properties; the API doesn't support them.
  for (const property in this) {
    if (this.hasOwnProperty(property) && !this[property]) {
      delete data[property];
    }
  }
  return JSON.stringify(data);
};

Entity.prototype._getPostFormData = function () {
  const that = this;
  return SchemaProcessing.getSchema(that.entity_type)
    .then((schema) => {
      const schemaAllOf = schema.allOf;
      const encodeForPost = function (key, value) {
        if (typeof value === 'boolean') {
          return Number(value);
        } else if (typeof value === 'function') {
          return undefined;
        }
        return value;
      };

      const form = JSON.parse(JSON.stringify(that, encodeForPost));
      schemaAllOf.map((schema) => {
        Object.keys(schema.properties).forEach((key) => {
          if (schema.properties[key].readonly) {
            delete form[key];
          }
        });
      });

      // flatten the currency elements
      for (const property in form) {
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
  const currencyValues = obj[fieldName];
  for (const currencyPair of currencyValues) {
    if (currencyPair.currency_code === currencyName) {
      if (setAmount) {
        currencyPair.value = setAmount;
      }
      return currencyPair.value;
    }
  }
  // if we are here it means it's not in the list
  if (setAmount) {
    const newEntry = {
      currency_code: currencyName,
      value: setAmount,
    };
    currencyValues.push(newEntry);
    return newEntry.value;
  }
}


module.exports = Entity;
