/// <reference path="../typings/node/node.d.ts"/>
class T1Connection {
    private config;
    private request = require('request');
    private headers = {'accept':'application/json'}

    constructor(config) {
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

                //Check for right status code
                if (response.statusCode !== 200) {
                    return console.log('Invalid Status Code Returned:', response.statusCode);
                }

                //All is good. Print the body
                console.log(body);
            });
    }

    public getSession(): void {
        this.request.get(
            {
                jar: true,
                headers: this.headers,
                url: "https://api.mediamath.com/api/v2.0/session",
            },
            function (error, response, body) {
                console.log(body)
            });
    }
}

export = T1Connection;