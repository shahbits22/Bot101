const API_AI_TOKEN = '41cfa157af724790b4226acf50647c0e';
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = 'EAACXpb5AwksBABVVLA9cMgnezjJ2ub2dA3HypTflLZAnFgxW7zei5SWgDjjXUTZAbGwhN7cAKCUsyDjVJbJf8FXn3JBRbZBNnkatHmwX5QjReQilpfbq36zZBm5ZBDFOZCC7V68Ch1rQ6kBse8shXWGfTLHHyuwgjpZCj7uV6rY0wZDZD';
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