/*
/*const dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const Podio = require('podio-js').api;

const fetch = require("node-fetch");



 instantiate the SDK
const podio = new Podio({
    authType: 'app',
    clientId: process.env.PodioClientId,
    clientSecret : process.env.podioClientSecret,

});

 get the API id/secret
const clientId = process.env.PodioClientId;
const clientSecret = process.env.PodioClientSecret;

 get the app ID and Token for appAuthentication
const appId = process.env.PodioAppId;
const appToken = process.env.PodioAppSecret;


console.log(clientId);
console.log(clientSecret);
console.log(appId);
console.log(appToken);

console.log(podio.clientId);

 


/*
const getHeaders = async () => {
    console.log("entered headers");
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    };
    console.log("after header")
    const token = appToken;
    headers.Authorization = `Bearer ${token}`;
    console.log("headers \n",headers);


    await fetch('https:podio.com/fridaygroup/intranet/apps/bookinger/items/6555')
        .then(res => res.text())
        .then(text => console.log("TEXT FROM .THEN \n", text))
        .catch(err => console.log(err));

    return headers;

};

getHeaders();


function test() {
    fetch('https:podio.com/fridaygroup/intranet/apps/bookinger/items')
        .then(result => console.log(result))

}

const getItem = async () => {
    const uri = `https:podio.com/fridaygroup/intranet/apps/bookinger/items`;

    const response = await fetch(uri, {
    }).then(response => JSON.stringify(response));
    console.log(response);

    const item = await response.json();
    return item;
}


podio.on('error', function(request, response, body) {
    console.log('There was a problem with a request to ' + request.path+'. Error was "'+body.error_description+'" ('+body.error+')');
});


podio.on('rateLimitError', function(request, response, body) {
    console.log('You hit the rate limit');
});

podio.authenticateWithApp(appId, appToken, function(response, body){
    podio.get('https:podio.com/fridaygroup/intranet/apps/bookinger/items/6555', {}, function(response, body){
        console.log(body);
    });
});

//module.exports = {
//    getHeaders
//};
*/