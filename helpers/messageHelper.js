import request from 'request';

const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

const sendTextMessage = (senderId, text) => {
 request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};


export function processMessage (event){

    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};

export function handlePostback (event){
    
        const senderId = event.sender.id;
        const message = event.message.text;
        const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
        apiaiSession.on('response', (response) => {
            const result = response.result.fulfillment.speech;
            sendTextMessage(senderId, result);
        });
        apiaiSession.on('error', error => console.log(error));
        apiaiSession.end();
    };