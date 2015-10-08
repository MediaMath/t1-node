/// <reference path="references.ts" />

const request = require('request');
const querystring = require('querystring');
const api_url = "https://api.mediamath.com/api/v2.0/";

class T1Connection {
    private config;
    private accept_headers = {'accept': 'application/vnd.mediamath.v1+json'};

    constructor(config, cb) {
        this.config = config;
        var login = request.post(
            {
                jar: true,
                url: api_url + "login",
                headers: this.accept_headers,
                form: {
                    user: config.user,
                    password: config.password,
                    api_key: config.api_key
                }
            },
            function (error, response, body) {
                //Check for error
                if (error) {
                    return console.log('Error:', error);
                }

                else {
                    cb(response, body)
                }
            });
    }

    private copyHeaders = function (source, sink) {
        Object.keys(source).forEach(function (key) {
            sink[key] = source[key];
        });
    };

    get(endpoint:string, cb) {
        request.get({
                jar: true,
                headers: this.accept_headers,
                url: api_url + endpoint,
            },
            function (error, response, body) {
                //Check for error
                if (error) {
                    return console.log('Error:', error);
                }

                else {
                    return cb(response, body);
                }
            });
    }

    getSession(cb):void {
        return this.get('session', cb);
    }

    post(endpoint:string, form:Object, cb) {

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
            },
            function (error, response, body) {
                //Check for error
                if (error) {
                    return console.log('Error:', error);
                }

                else {
                    return cb(response, body);
                }
            });
    }

}

export = T1Connection;
