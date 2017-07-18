

const TargetSegments = function TargetSegments(connection) {
  this.data = {};
  this.meta = {};

  if (connection) {
    this.get(connection);
  }
};

TargetSegments.prototype.get = function get(connection, parentId) {
  if (connection) {
    const that = this;
    let endpoint = '/targeting_segments?full=*';
    if (parentId) {
      endpoint += `&parent=${parentId}`;
    }
    return connection.get(endpoint)
      .then((body) => {
        const content = JSON.parse(body);
        return that.updateTargeting(content.data, content.meta);
      });
  }
  throw new Error('connection object must be provided');
};


// called on successful get/save
TargetSegments.prototype.updateTargeting = function updateTargeting(data, meta) {
  this.data = data;
  this.meta = meta;
  return this;
};

TargetSegments.prototype.save = function save() {
  console.info('updating targeting segments is not implemented');
};

module.exports = TargetSegments;
