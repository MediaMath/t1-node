var rp = require('request-promise');
var querystring = require('querystring');
var config = require('./config');
var T1Connection = (function () {

    function T1Connection(t1config, cb) {
        this.accept_headers = { 'accept': 'application/vnd.mediamath.v1+json' };
        this.copyHeaders = function (source, sink) {
            Object.keys(source).forEach(function (key) {
                sink[key] = source[key];
            });
        };

        this.t1config = t1config;
        rp.post({
            jar: true,
            url: config.apiUrl + "login",
            headers: this.accept_headers,
            form: {
                user: t1config.user,
                password: t1config.password,
                api_key: t1config.api_key
            }
        }).then(cb);
    }

    T1Connection.prototype.get = function (endpoint) {
        var options = {
            jar: true,
            headers: this.accept_headers,
            url: config.apiUrl + endpoint
        };
        return rp.get(options);
    };

    T1Connection.prototype.getSession = function () {
        return this.get('session');
    };

    T1Connection.prototype.post = function (endpoint, form) {
        var formData = querystring.stringify(form);
        var contentLength = formData.length;
        var post_headers = {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.copyHeaders(this.accept_headers, post_headers);
        return rp.post({
            jar: true,
            headers: post_headers,
            url: config.apiUrl + endpoint,
            body: formData
        });
    };
    return T1Connection;
})();

module.exports = T1Connection;
