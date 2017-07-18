const EntityMap = require('../entitymap');

// base prototype for targeting - shouldn't be used directly.
const Targeting = function Targeting(targetingQueryString, targetingPostString, id) {
  this.targetingQueryString = targetingQueryString;
  this.targetingPostString = targetingPostString;
  this.strategy_id = id;
};

Targeting.prototype.get = function get(strategy_id, connection) {
  if (connection) {
    const that = this;
    const endpoint = `${EntityMap.getEndpoint('strategy')}/${strategy_id}/${that.targetingQueryString}`;
    return connection.get(endpoint)
      .then((body) => {
        that.strategy_id = strategy_id;
        const content = JSON.parse(body);
        return that.updateTargeting(content.data, content.meta);
      });
  }
  throw new Error('no connection supplied');
};


// called on successful get/save
Targeting.prototype.updateTargeting = function updateTargeting(data, meta) {
  this.data = data;
  this.meta = meta;

  console.warn('updateTargeting should be implemented by a derived class');
  return this;
};


Targeting.prototype.save = function save(connection) {
  const that = this;
  return that.generateForm()
    .then((form) => {
      const endpoint = `${EntityMap.getEndpoint('strategy')}/${
                that.strategy_id}/${
                that.targetingPostString}`;

      return connection.postFormdata(endpoint, form).then((body) => {
        const content = JSON.parse(body);
        return that.updateTargeting(content.data, content.meta);
      });
    });
};

Targeting.prototype.generateForm = function generateFormfunction() {
  console.error('generateForm is not implemented!');
};


module.exports = Targeting;
