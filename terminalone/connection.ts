/// <reference path="../typings/node/node.d.ts"/>

class T1Connection {
    private config;
    private request = require('request');
    private headers = {'accept':'application/vnd.mediamath.v1+json'};

    constructor(config, cb) {
        this.config = config;
        var login = this.request.post(
            {
                jar: true,
                url: "https://api.mediamath.com/api/v2.0/login",
                headers: this.headers,
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

    public get(endpoint: string, cb) {
        this.request.get( {
                jar: true,
                headers: this.headers,
                url: "https://api.mediamath.com/api/v2.0/" + endpoint,
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

    public getSession(cb): void {
        return this.get('session', cb);
    }

}

export = T1Connection;