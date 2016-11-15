var RequestPromise = require('request-promise');
var QueryString = require('querystring');
var Config = require('./common/config');
var BPromise = require('bluebird');
var OauthService = require('simple-oauth2');

var T1Connection = function (t1config) {
    this.cookieAuthed = false;
    this.t1config = t1config;
    var package = require('../package.json');
    this.requestHeaders = {
        'Accept': 'application/vnd.mediamath.v1+json',
        'User-Agent': package.name + '-node/' + package.version
    };

    if (!t1config.apiBaseUrl) {
        this.t1config.apiBaseUrl = Config.apiBaseUrl;
    }
    this.t1config.apiUrl = t1config.apiBaseUrl + '/api/v2.0/';
};

T1Connection.prototype.ensureAuthenticated = function () {
    var that = this;
    return BPromise.try(function () {
        if (!that.cookieAuthed && this.oauth2 === undefined) {
            return RequestPromise.post({
                jar: true,
                url: that.t1config.apiUrl + "login",
                headers: that.requestHeaders,
                withCredentials: true,
                form: {
                    user: that.t1config.user,
                    password: that.t1config.password,
                    api_key: that.t1config.api_key
                }
            }).then(function () {
                that.cookieAuthed = true;
            });

        } else if (that.oauth2) {
            if (that.oauth2Token) {
                if (that.oauth2Token.expired()) {
                    that.oauth2Token.refresh()
                        .then((result) => {
                            that.oauth2Token = result;
                            if (that.tokenUpdatedCallback !== undefined) {
                                that.tokenUpdatedCallback(result.token);
                            }
                        });
                }
            }
            else {
                BPromise.reject("No oauth2 token! Ensure the " +
                    "oauth2 flow is completed by calling getToken()");
            }
        }
    });
};

T1Connection.prototype.initializeOauth = function (tokenUpdatedCallback) {
    var that = this;
    var credentials = {
        client: {
            id: that.t1config.api_key,
            secret: that.t1config.client_secret
        },
        auth: {
            tokenHost: Config.apiBaseUrl,
            tokenPath: 'oauth2/v1.0/token',
            authorizePath: 'oauth2/v1.0/authorize'
        },
        http: {
            headers: that.requestHeaders
        }
    };
    that.tokenUpdatedCallback = tokenUpdatedCallback;
    that.oauth2 = OauthService.create(credentials);
};

// Call to start off the oauth2 flow
T1Connection.prototype.fetchAuthUrl = function (tokenUpdatedCallback) {
    var that = this;
    if (!that.oauth2) {
        that.initializeOauth(tokenUpdatedCallback);
    }
    return this.oauth2.authorizationCode.authorizeURL({
        redirect_uri: that.t1config.redirect_uri
    });
};

// your application should redirect to the T1 user authorisation URL fetched
// from fetchAuthUrl(). T1 will then 301 to your redirect_uri with a 'code' URL param.
// Use that code to obtain the access token. The flow is now complete.
// t1-node will handle setting the bearer headers, and renewing access.
T1Connection.prototype.getToken = function (code) {
    var that = this;
    that.tokenConfig = {
        code: code,
        redirect_uri: that.t1config.redirect_uri
    };
    return that.oauth2.authorizationCode.getToken(that.tokenConfig)
        .then((result) => {
            that.oauth2Token = that.oauth2.accessToken.create(result);
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
        headers: this.requestHeaders,
        url: this.t1config.apiUrl + endpoint,
        withCredentials: true
    };
    return this.ensureAuthenticated()
        .then(function () {
            return RequestPromise.get(options);
        });
};

T1Connection.prototype.getSession = function () {
    return this.get('session');
};

T1Connection.prototype.post = function (endpoint, form) {
    var that = this;
    var formData = QueryString.stringify(form);
    var contentLength = formData.length;
    var postHeaders = {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (this.oauth2Token) {
        postHeaders.Authorization = 'Bearer ' + this.oauth2Token.token.access_token;
    }
    this.copyHeaders(this.requestHeaders, postHeaders);
    return this.ensureAuthenticated()
        .then(function () {
            return RequestPromise.post({
                    jar: true,
                    withCredentials: true,
                    headers: postHeaders,
                    url: that.t1config.apiUrl + endpoint,
                    body: formData
                }
            );
        });
};

T1Connection.prototype.buildQueryString = function (baseUrl, userParams) {
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
        }
        else if (p === 'with') {
            urlParams.push(userParams[p].map(function (i) {
                return 'with=' + i;
            }).join('&'));
        }
        else {
            urlParams.push(encodeURIComponent(p) + "=" + encodeURIComponent(userParams[p]));
        }
    }

    if (Object.keys(userParams).length > 0) {
        endpoint += '?' + urlParams.join("&");
    }

    return endpoint;
};


module.exports = T1Connection;
