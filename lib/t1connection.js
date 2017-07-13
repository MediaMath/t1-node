'use strict';

var RequestPromise = require('request-promise');
var QueryString = require('querystring');
var BPromise = require('bluebird');
var OauthService = require('simple-oauth2');

var T1Connection = function(t1config) {
  this.t1config = t1config;
  this.baseUrl = t1config.baseUrl || 'https://api.mediamath.com/';
  let pkg = require('../package.json');
  this.requestHeaders = {
    'Accept': 'application/vnd.mediamath.v1+json',
    'User-Agent': pkg.name + '-node/' + pkg.version
  };
};

T1Connection.prototype.ensureAuthenticated = function() {
  let that = this;
  return BPromise.try(function() {
    if (!that.requestHeaders.adama_session || !that.requestHeaders.Authorization) {
      if (that.t1config.preferCookieAuth === false) {
        return that.getOAuthToken();
      } else {
        return that.getCookieSession();
      }
    }
  });
};

T1Connection.prototype.getCookieSession = function() {
  let that = this;

  return RequestPromise.post({
    jar: true,
    url: this.baseUrl + 'api/v2.0/login',
    headers: that.requestHeaders,
    withCredentials: true,
    form: {
      user: that.t1config.user,
      password: that.t1config.password,
      api_key: that.t1config.api_key
    }
  }).then(function(result) {
    return JSON.parse(result);
  }).catch(function(error) {
    console.error('a connection error occurred: ' + error.message);
  });
};

T1Connection.prototype.getOAuthToken = function() {
  let that = this;

  let credentials = {
    client: {
      id: this.t1config.client_id,
      secret: this.t1config.client_secret
    },
    auth: {
      tokenHost: 'https://sso.mediamath.auth0.com',
      tokenPath: '/oauth/token'
    },
    options: {
      useBasicAuthorizationHeader: false
    }
  };
  if (that.t1config.environment === 'dev') {
    credentials.auth.tokenHost = 'https://sso.mediamath-dev.auth0.com';
  }

  let tokenConfig = {
    username: that.t1config.user,
    password: that.t1config.password,
    scope: 'openid profile'
  };
  let OAuthConnection = OauthService.create(credentials);
  return OAuthConnection.ownerPassword
    .getToken(tokenConfig)
    .then((result) => {
      const token = OAuthConnection.accessToken.create(result);
      that.requestHeaders.Authorization = 'Bearer ' + token.token.id_token;
    });
};

T1Connection.prototype.copyHeaders = function(source, sink) {
  Object.keys(source).forEach(function(key) {
    sink[key] = source[key];
  });
};

T1Connection.prototype.get = function(endpoint) {
  // Check if there's a full path going in here, and fix it.
  if (endpoint.includes(this.baseUrl)) {
    endpoint = endpoint.substring(this.baseUrl.length, endpoint.length);
  }

  let options = {
    jar: true,
    headers: this.requestHeaders,
    url: this.baseUrl + endpoint,
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

T1Connection.prototype.postFormdata = function (endpoint, form) {
  let formdata = QueryString.stringify(form);
  let contentLength = formdata.length;
  let postHeaders = {
    'Content-Length': contentLength,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return this._post(endpoint, postHeaders, formdata);
};

T1Connection.prototype.postJson = function (endpoint, json) {
  let postHeaders = {
    'Content-Type': 'application/json'
  };
    
  return this._post(endpoint, postHeaders, json);
};

T1Connection.prototype._post = function (endpoint, headers, data) {
  let that = this;
  if (this.oauth2Token) {
    headers.Authorization = 'Bearer ' + this.oauth2Token.token.access_token;
  }
  this.copyHeaders(this.requestHeaders, headers);
  return this.ensureAuthenticated()
    .then(function () {
      return RequestPromise.post({
        jar: true,
        withCredentials: true,
        headers,
        url: that.baseUrl + endpoint,
        body: data
      }
      );
    });
};

T1Connection.prototype.buildQueryString = function(baseUrl, userParams) {
  let endpoint = baseUrl;
  if (!userParams) {
    userParams = {};
  }
  userParams.api_key = this.t1config.api_key !== undefined ? this.t1config.api_key : 'noapikey';

  let urlParams = [];
  if (userParams.limit !== undefined) {
    let entity = Object.keys(userParams.limit)[0];
    endpoint += ('/limit/' + entity +
            '=' + userParams.limit[entity]);
  }
  for (let p in userParams) {
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
      urlParams.push(encodeURIComponent(p) + '=' + encodeURIComponent(userParams[p]));
    }
  }

  if (Object.keys(userParams).length > 0) {
    endpoint += '?' + urlParams.join('&');
  }

  return endpoint;
};


module.exports = T1Connection;
