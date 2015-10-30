var request = require('request');
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
        var login = request.post({
            jar: true,
            url: config.apiUrl + "login",
            headers: this.accept_headers,
            form: {
                user: t1config.user,
                password: t1config.password,
                api_key: t1config.api_key
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
            url: config.apiUrl + endpoint
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
            url: config.apiUrl + endpoint,
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
