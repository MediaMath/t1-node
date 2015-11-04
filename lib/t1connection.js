var rp = require('request-promise');
var Q = require('q');
var request = require('request');
var querystring = require('querystring');
var config = require('./config');
var T1Connection = (function () {

    function T1Connection(t1config) {
        this.loggedIn = false;
        this.t1config = t1config;
        this.accept_headers = {'accept': 'application/vnd.mediamath.v1+json'};

    }

    T1Connection.prototype.logIn = function () {
        var that = this;
        if (!this.loggedIn) {
            return rp.post({
                jar: true,
                url: config.apiUrl + "login",
                headers: this.accept_headers,
                form: {
                    user: this.t1config.user,
                    password: this.t1config.password,
                    api_key: this.t1config.api_key
                }
            }).then(that.loggedIn = true);
        }
        else return Q(undefined);
    };

    T1Connection.prototype.copyHeaders = function (source, sink) {
        Object.keys(source).forEach(function (key) {
            sink[key] = source[key];
        });
    };

    T1Connection.prototype.get = function (endpoint) {
        var options = {
            jar: true,
            headers: this.accept_headers,
            url: config.apiUrl + endpoint
        };
        return this.logIn()
            .then(function () {
                return rp.get(options)
            });
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
        return this.logIn()
            .then(function () {
                return rp.post({
                    jar: true,
                    headers: post_headers,
                    url: config.apiUrl + endpoint,
                    body: formData
                }
            )});
    };
    return T1Connection;
})();

module.exports = T1Connection;
