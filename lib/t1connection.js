var RequestPromise = require('request-promise');
var QueryString = require('querystring');
var Config = require('./common/config');
var BPromise = require('bluebird');
var simpleoauth2 = require('simple-oauth2');

var T1Connection = function(t1config) {
    this.cookieAuthed = false;
    this.oAuth2Token = null;
    this.t1config = t1config;
    var pkg = require('../package.json');
    this.requestHeaders = {
        'Accept': 'application/vnd.mediamath.v1+json',
        'User-Agent': pkg.name + '-node/' + pkg.version
    };


    if (!t1config.apiBaseUrl) {
        this.t1config.apiBaseUrl = Config.apiBaseUrl;
    }
};

T1Connection.prototype.ensureAuthenticated = function() {
    var that = this;
    return BPromise.try(function() {
        if (!that.cookieAuthed && that.oAuth2Token === null) {
            return RequestPromise.post({
                jar: true,
                url: that.t1config.apiBaseUrl + "/api/v2.0/login",
                headers: that.requestHeaders,
                withCredentials: true,
                form: {
                    user: that.t1config.user,
                    password: that.t1config.password,
                    api_key: that.t1config.api_key
                }
            }).then(function() {
                that.cookieAuthed = true;
            }).catch(function(error) {
                console.error("a connection error occurred: " + error.message);
            });
        } else if (that.oauth2Token) {
            console.log("Authenticated with oauth token"+that.oauth2Token)
            if (that.oauth2Token.expired()) {
                that.oauth2Token.refresh()
                    .then((result) => {
                        that.oauth2Token = result;
                    });
            }
        } else {
            BPromise.reject("No oauth2 token! Ensure the " +
                "oauth2 flow is completed by calling getToken()");
        }
    });
};


T1Connection.prototype.getToken = function() {
    var that = this;

    const credentials = {
        client: {
            id: this.t1config.client_id,
            secret: this.t1config.client_secret
        },
        auth: {
            tokenHost: Config.auth_url,
            tokenPath: "/oauth/ro"
        },
        options: {
            useBasicAuthorizationHeader: false
        }
    };

    that.oauth2 = simpleoauth2.create(credentials);
    const tokenConfig = {
        username: that.t1config.user,
        password: that.t1config.password,
        connection: Config.connection,
        scope: 'openid profile'
    };

    that.oauth2.ownerPassword.getToken(tokenConfig)
        .then(
            (result) => {
                that.oAuth2Token = that.oauth2.accessToken.create(result);
                console.log(that.oAuth2Token)
                return that.oAuth2Token;
            });
};

T1Connection.prototype.copyHeaders = function(source, sink) {
    Object.keys(source).forEach(function(key) {
        sink[key] = source[key];
    });
};

T1Connection.prototype.get = function(endpoint) {
    var options = {
        jar: true,
        headers: this.requestHeaders,
        url: this.t1config.apiBaseUrl + endpoint,
        withCredentials: true
    };
    return this.ensureAuthenticated()
        .then(function() {
            return RequestPromise.get(options);
        });
};

T1Connection.prototype.getSession = function() {
    return this.get('session');
};

T1Connection.prototype.post = function(endpoint, form) {
    var that = this;
    var formData = QueryString.stringify(form);
    var contentLength = formData.length;
    var postHeaders = {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (this.oauth2Token) {
        postHeaders.Authorization = 'Bearer ' + this.oauth2Token;
    }
    this.copyHeaders(this.requestHeaders, postHeaders);
    return this.ensureAuthenticated()
        .then(function() {
            return RequestPromise.post({
                jar: true,
                withCredentials: true,
                headers: postHeaders,
                url: that.t1config.apiBaseUrl + endpoint,
                body: formData
            });
        });
};

T1Connection.prototype.buildQueryString = function(baseUrl, userParams) {
    var endpoint = baseUrl;
    if (!userParams) {
        userParams = {};
    }
    userParams.api_key = this.t1config.api_key !== undefined ? this.t1config.api_key : 'noapikey';

    var urlParams = [];
    if (userParams.limit !== undefined) {
        var entity = Object.keys(userParams.limit)[0];
        endpoint += ('/limit/' + entity +
            '=' + userParams.limit[entity]);
    }
    for (var p in userParams) {
        if (!userParams.hasOwnProperty(p)) {
            continue;
        }
        if (p === 'limit') {
            //skip
        } else if (p === 'with') {
            urlParams.push(userParams[p].map(function(i) {
                return 'with=' + i;
            }).join('&'));
        } else {
            urlParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(userParams[p]));
        }
    }

    if (Object.keys(userParams).length > 0) {
        endpoint += '?' + urlParams.join("&");
    }

    return endpoint;
};


module.exports = T1Connection;
