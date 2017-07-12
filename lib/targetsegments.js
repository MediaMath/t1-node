var TargetSegments = function (connection) {
  this.data = {};
  this.meta = {};

  if (connection) {
    this.get(connection);
  }
};

TargetSegments.prototype.get = function (connection, parentId) {
  if (connection) {
    var that = this;
    var endpoint = '/targeting_segments?full=*';
    if (parentId) {
      endpoint += '&parent=' + parentId;
    }
    return connection.get(endpoint)
      .then(function (body) {
        var content = JSON.parse(body);
        return that.updateTargeting(content.data, content.meta);
      });
  }
};


// called on successful get/save
TargetSegments.prototype.updateTargeting = function (data, meta) {

  this.data = data;
  this.meta = meta;
  return this;
};

TargetSegments.prototype.save = function () {
  console.info('updating targeting segments is not implemented');
};

module.exports = TargetSegments;
