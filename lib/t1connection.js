const RequestPromise = require('request-promise');
const QueryString = require('querystring');
const BPromise = require('bluebird');
const OauthService = require('simple-oauth2');
const pkg = require('../package.json');

const T1Connection = function T1Connection(t1config) {
  this.t1config = t1config;
  this.baseUrl = t1config.baseUrl || 'https://api.mediamath.com/';
  this.requestHeaders = {
    Accept: 'application/vnd.mediamath.v1+json',
    'User-Agent': `${pkg.name}-node/${pkg.version}`,
  };
};

T1Connection.prototype.ensureAuthenticated = function ensureAuthenticated() {
  const that = this;
  return BPromise.try(() => {
    if (!that.requestHeaders.adama_session || !that.requestHeaders.Authorization) {
      if (that.t1config.preferCookieAuth === false) {
        return that.getOAuthToken();
      }
      return that.getCookieSession();
    }
    return true;
  });
};

T1Connection.prototype.getCookieSession = function getCookieSession() {
  const that = this;

  return RequestPromise.post({
    jar: true,
    url: `${this.baseUrl}api/v2.0/login`,
    headers: that.requestHeaders,
    withCredentials: true,
    form: {
      user: that.t1config.user,
      password: that.t1config.password,
      api_key: that.t1config.api_key,
    },
  }).then(result => JSON.parse(result)).catch((error) => {
    console.error(`a connection error occurred: ${error.message}`);
  });
};

T1Connection.prototype.getOAuthToken = function getOAuthToken() {
  const that = this;

  const credentials = {
    client: {
      id: this.t1config.client_id,
      secret: this.t1config.client_secret,
    },
    auth: {
      tokenHost: 'https://auth.mediamath.com',
      tokenPath: '/oauth/token',
    },
    options: {
      useBasicAuthorizationHeader: false,
    },
  };
  if (that.t1config.environment === 'dev') {
    credentials.auth.tokenHost = 'https://mediamath-dev.auth0.com';
  }

  const tokenConfig = {
    username: that.t1config.user,
    password: that.t1config.password,
    scope: 'openid profile',
  };
  const OAuthConnection = OauthService.create(credentials);
  return OAuthConnection.ownerPassword
    .getToken(tokenConfig)
    .then((result) => {
      const token = OAuthConnection.accessToken.create(result);
      that.requestHeaders.Authorization = `Bearer ${token.token.id_token}`;
    });
};

T1Connection.prototype.copyHeaders = function copyHeaders(source, sink) {
  Object.keys(source).forEach((key) => {
    sink[key] = source[key];
  });
};

T1Connection.prototype.get = function get(endpoint) {
  let url = endpoint;
  // Check if there's a full path going in here, and fix it.
  if (endpoint.includes(this.baseUrl)) {
    url = endpoint.substring(this.baseUrl.length, endpoint.length);
  }

  const options = {
    jar: true,
    headers: this.requestHeaders,
    url: this.baseUrl + url,
    withCredentials: true,
  };

  return this.ensureAuthenticated()
    .then(() => RequestPromise.get(options));
};

T1Connection.prototype.getSession = function getSession() {
  return this.get('session');
};

T1Connection.prototype.postFormdata = function postFormdata(endpoint, form) {
  const formdata = QueryString.stringify(form);
  const contentLength = formdata.length;
  const postHeaders = {
    'Content-Length': contentLength,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  return this.post(endpoint, postHeaders, formdata);
};

T1Connection.prototype.postJson = function postJson(endpoint, json) {
  const postHeaders = {
    'Content-Type': 'application/json',
  };

  return this.post(endpoint, postHeaders, json);
};

T1Connection.prototype.post = function post(endpoint, headers, data) {
  const that = this;
  const requestHeaders = headers;
  if (this.oauth2Token) {
    requestHeaders.Authorization = `Bearer ${this.oauth2Token.token.access_token}`;
  }
  this.copyHeaders(this.requestHeaders, headers);
  return this.ensureAuthenticated()
    .then(() => RequestPromise.post({
      jar: true,
      withCredentials: true,
      headers: requestHeaders,
      url: that.baseUrl + endpoint,
      body: data,
    }));
};

T1Connection.prototype.buildQueryString = function buildQueryString(baseUrl, userParams) {
  let endpoint = baseUrl;
  let queryParams = userParams;
  if (!queryParams) {
    queryParams = {};
  }
  queryParams.api_key = this.t1config.api_key !== undefined ? this.t1config.api_key : 'noapikey';

  const urlParams = [];
  if (queryParams.limit !== undefined) {
    const entity = Object.keys(queryParams.limit)[0];
    endpoint += (`/limit/${entity}=${queryParams.limit[entity]}`);
  }
  Object.keys(queryParams).forEach((p) => {
    if (p === 'limit') {
      // skip
    } else if (p === 'with') {
      urlParams.push(queryParams[p].map(i => `with=${i}`).join('&'));
    } else {
      urlParams.push(`${encodeURIComponent(p)}=${encodeURIComponent(queryParams[p])}`);
    }
  });

  if (Object.keys(queryParams).length > 0) {
    endpoint += `?${urlParams.join('&')}`;
  }

  return endpoint;
};


module.exports = T1Connection;
