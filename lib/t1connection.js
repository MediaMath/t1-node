var rp = require('request-promise');
var Promise = require('bluebird');
var request = require('request');
var querystring = require('querystring');
var config = require('./config');

var T1Connection = function (t1config) {
    this.loggedIn = false;
    this.t1config = t1config;
    this.accept_headers = {'accept': 'application/vnd.mediamath.v1+json'};
};

T1Connection.prototype.logIn = function () {
    var that = this;
    return Promise.try(function () {
        if (!this.loggedIn) {
            return rp.post({
                jar: true,
                url: config.apiUrl + "login",
                headers: that.accept_headers,
                form: {
                    user: that.t1config.user,
                    password: that.t1config.password,
                    api_key: that.t1config.api_key
                }
            }).then(that.loggedIn = true);
        } else {
            return undefined;
        }
    });
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
            )
        });
};

T1Connection.buildQueryString = function (baseUrl, userParams) {
    var endpoint = baseUrl;
    if (userParams) {
        var str = [];
        if (userParams.limit !== undefined) {
            var entity = Object.keys(userParams.limit)[0];
            endpoint+=('/limit/' + entity +
            '=' + userParams.limit[entity])
        }
        for (var p in userParams)
            if (userParams.hasOwnProperty(p)) {
                if (p === 'limit') {
                    //skip
                }
                else if (p === 'with') {
                    str.push(userParams[p].map(function (i) {
                        return 'with=' + i
                    }).join('&'))
                }
                else {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(userParams[p]));
                }

            }
        if (Object.keys(userParams).length > 0) {
            endpoint += '?' + str.join("&");
        }
    }
    return endpoint;
};


module.exports = T1Connection;
