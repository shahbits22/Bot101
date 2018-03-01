import request from 'request';
const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_API_URL = 'https://graph.facebook.com/v2.6/me';
const GET_STARTED = 'Get started';
const MANAGE_PRESCRIPTION = 'Manage prescription';
const PERSISTANT_MENU = {
    "persistent_menu":[
      {
        "locale":"default",
        "composer_input_disabled": false,
        "call_to_actions":[
            {
            "title":"Register Account",
            "type":"web_url",
            "url":"https://www.paypal.com/welcome/signup/#/email_password",
            "webview_height_ratio":"full"
            },
            {
            "type":"postback",
            "title":"Manage Prescriptions",
            "payload":MANAGE_PRESCRIPTION
            },
            {
                "title":"Update Account",
                "type":"web_url",
                "url":"https://www.paypal.com/welcome/signup/#/email_password",
                "webview_height_ratio":"full"
            }
        ]

      }
    ]
  }


const sendTextMessage = (senderId, text) => {
    request({
       url: `${FACEBOOK_API_URL}/messages`,
       qs: { access_token: FACEBOOK_ACCESS_TOKEN },
       method: 'POST',
       json: {
               recipient: { id: senderId },
               message: { text },
           }
       });
   };


export const processMessage = (event) => {
    
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });
    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
}

export const handlePostback = (event) => {
        const senderId = event.sender.id;
        const message = event.message.text;
        const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
        apiaiSession.on('response', (response) => {
            const result = response.result.fulfillment.speech;
            sendTextMessage(senderId, result);
        });
        apiaiSession.on('error', error => console.log(error));
        apiaiSession.end();
    }

export const setupGetStarted = () => {
    request({
        url: `${FACEBOOK_API_URL}/messenger_profile`,
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            "get_started":{
                "payload":GET_STARTED
              }
            }
        });
}

export const setupPersistantMenu = () => {
    request({
        url: `${FACEBOOK_API_URL}/messenger_profile`,
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: PERSISTANT_MENU
        });
}





// export function processMessage (event){

//     const senderId = event.sender.id;
//     const message = event.message.text;
//     const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
//     apiaiSession.on('response', (response) => {
//         const result = response.result.fulfillment.speech;
//         sendTextMessage(senderId, result);
//     });
//     apiaiSession.on('error', error => console.log(error));
//     apiaiSession.end();
// };

// export function handlePostback (event){
    
//         const senderId = event.sender.id;
//         const message = event.message.text;
//         const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'paypal_hack_bot'});
//         apiaiSession.on('response', (response) => {
//             const result = response.result.fulfillment.speech;
//             sendTextMessage(senderId, result);
//         });
//         apiaiSession.on('error', error => console.log(error));
//         apiaiSession.end();
//     };