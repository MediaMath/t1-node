var TargetSegments = function (connection) {
    this.data = {};
    this.meta = {};
    this.schemaLoaded = false;

    if (connection != null) {
        this.get(connection)
    }
};

TargetSegments.prototype.get = function (connection, parent_id) {
    if (connection != null) {
        var that = this;
        var endpoint = "/targeting_segments?full=*";
        if (parent_id != null) {
            endpoint += '&parent=' + parent_id
        }
        return connection.get(endpoint)
            .then(function (body) {
                var content = JSON.parse(body);
                return that.update_targeting(content.data, content.meta);
            });
    }
};


// called on successful get/save
TargetSegments.prototype.update_targeting = function (data, meta) {

    this.data = data;
    this.meta = meta;
    return this;
};

TargetSegments.prototype.save = function (connection) {
    console.info('updating targeting segments is not implemented')
};

module.exports = TargetSegments;
