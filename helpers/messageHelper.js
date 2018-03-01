import request from 'request';
const API_AI_TOKEN = process.env.API_AI_TOKEN;
const apiAiClient = require('apiai')(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_API_URL = 'https://graph.facebook.com/v2.6/me';
const GET_STARTED = 'Get started';
const WELCOME_MESSAGE = 'Hi there, thank you for invoking “SamVedna (powered by PayPal).';
const GREETING = {
    "greeting":[
        {
          "locale":"default",
          "text":"Hello!"
        }, {
          "locale":"en_US",
          "text":"Timeless apparel for the masses."
        }
      ]
};
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

const sendPrescriptions = (senderId, text) => {
let elements = [
    {
        "title":"Tylenol",
        "image_url":"https://pacific-headland-84917.herokuapp.com/images/tylenol.png",
        "subtitle":"<span>Refill Remaining: 2</span>",
        "buttons":[
          {
            "type":"postback",
            "payload":"Tylenol",
            "title":"Refill"
          }          
        ]      
    },
    {
        "title":"Thyroid medication",
        "image_url":"https://pacific-headland-84917.herokuapp.com/images/Thyroid.png",
        "subtitle":"<span>Refill Remaining: 1</span>",
        "buttons":[
          {
            "type":"postback",
            "payload":"Thyroid medication",
            "title":"Refill"
          }          
        ]      
    },
    {
        "title":"Metformin",
        "image_url":"https://pacific-headland-84917.herokuapp.com/images/metformin.png",
        "subtitle":"<span>Refill Remaining: 2</span><br/><span>Available after: March 7th, 2018</span>"
        
    }
];
request({
    url: `${FACEBOOK_API_URL}/messages`,
    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
    method: 'POST',
    json: {
            recipient: { id: senderId },
            message: {
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"generic",
                    "elements": elements
                  }
                }
            }
        }
    },function (error, response, body) {
        if (error) {
          return console.error('Could not send prescriptions:', error);
        }
        console.log('Prescriptions sent successfully!  Server responded with:', body);
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

export const handlePostback = (senderId, postback) => {

        const message = postback.payload;
        if(message == GET_STARTED){
            //handle login to send welcome message;
            sendTextMessage(senderId, WELCOME_MESSAGE);
        }
        else if(message == MANAGE_PRESCRIPTION){
            //handle logic to send available prescriptions
            sendPrescriptions(senderId);
        }else{
            sendTextMessage(senderId, 'Thank you for ordering Tylenol prescription');
        }
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
        },function (error, response, body) {
            if (error) {
              return console.error('get started failed:', error);
            }
            console.log('get started successful!  Server responded with:', body);
          });
}

export const setupPersistantMenu = () => {
    request({
        url: `${FACEBOOK_API_URL}/messenger_profile`,
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: PERSISTANT_MENU
        },function (error, response, body) {
            if (error) {
              return console.error('Create persistant menu failed:', error);
            }
            console.log('Create persistant menu successful!  Server responded with:', body);
          });
}

export const retrieveProperties = () => {
    request({
        url: `${FACEBOOK_API_URL}/messenger_profile?`,
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'GET',
        json: PERSISTANT_MENU
        },function (error, response, body) {
            if (error) {
              return console.error('Create persistant menu failed:', error);
            }
            console.log('Create persistant menu successful!  Server responded with:', body);
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