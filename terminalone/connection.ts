/// <reference path="../typings/node/node.d.ts"/>

class T1Connection {
    private config;
    private request = require('request');
    private headers = {'accept':'application/json'};

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

    public getSession(cb): void {
        this.request.get(
            {
                jar: true,
                headers: this.headers,
                url: "https://api.mediamath.com/api/v2.0/session",
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

}

export = T1Connection;