const API_AI_TOKEN = '41cfa157af724790b4226acf50647c0e';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAANyiVLdk3IBAPlz0mZApWOGV9nZCOXQXM5gBnBF4oqzZCZCAX2VoS2nrVp7uEqoAPZCWaIEZBCklpaN1fqhJSGEroefZB48HSZChwwWtWIIRvEa4nDdD3QhX7Eem2cX0jGFmXAM94ccsTZAZCVCwlLZAGSMPl7TAFd4Dh4PJxTX7ZAsAAZDZD';
const request = require('request');

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

module.exports = (event) => {
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