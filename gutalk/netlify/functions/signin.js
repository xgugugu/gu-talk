const fetch = require('node-fetch');

const API_ENDPOINT = 'https://github.com/login/oauth/access_token';
const CLIENT_ID = '10563cad7a654a79848c';
const CLIENT_SECRET = '733e9c3cbfbf1c48a4243cc5d40ce1305874f038';

exports.handler = async (event, context) => {
    let response;
    try {
        response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: event.queryStringParameters.code
            }),
            headers: {
                accept: 'application/json'
            }
        });
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({
                error: err.message
            })
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            data: response
        })
    };
}