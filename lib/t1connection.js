var request = require('request');
var querystring = require('querystring');
var api_url = "https://api.mediamath.com/api/v2.0/";
var T1Connection = (function () {

    function T1Connection(config, cb) {
        this.accept_headers = { 'accept': 'application/vnd.mediamath.v1+json' };
        this.copyHeaders = function (source, sink) {
            Object.keys(source).forEach(function (key) {
                sink[key] = source[key];
            });
        };

        this.config = config;
        var login = request.post({
            jar: true,
            url: api_url + "login",
            headers: this.accept_headers,
            form: {
                user: config.user,
                password: config.password,
                api_key: config.api_key
            }
        }, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }
            else {
                cb(response, body);
            }
        });
    }

    T1Connection.prototype.get = function (endpoint, cb) {
        request.get({
            jar: true,
            headers: this.accept_headers,
            url: api_url + endpoint
        }, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }
            else {
                return cb(response, body);
            }
        });
    };

    T1Connection.prototype.getSession = function (cb) {
        return this.get('session', cb);
    };

    T1Connection.prototype.post = function (endpoint, form, cb) {
        var formData = querystring.stringify(form);
        var contentLength = formData.length;
        var post_headers = {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.copyHeaders(this.accept_headers, post_headers);
        request.post({
            jar: true,
            headers: post_headers,
            url: api_url + endpoint,
            body: formData
        }, function (error, response, body) {
            //Check for error
            if (error) {
                return console.log('Error:', error);
            }
            else {
                return cb(response, body);
            }
        });
    };
    return T1Connection;
})();

module.exports = T1Connection;
