const qrcode = require('qrcode-terminal');
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// const quotable = require('quotable');


const client = new Client({
    authStrategy: new LocalAuth(),
});
 
client.initialize();
 
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});
 
client.on('authenticated', () => {
    console.log('Authenticated');
  });
 
client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
    console.log(message.body);
});

client.on('message', message => {
    if(message.body === '!ping') {
        message.reply('pong');
    }
});
   
client.on('message', async (message) => {
            if (message.body.includes('going to')){
            //const aNewQuote = await quotable.getRandomQuote();
            //console.log(aNewQuote.content)};
            message.reply( 'How long will it take you ?' )}
  });

  client.on('message', async (message) => {
    if (message.body.includes('mins') || message.body.includes('minutes') || message.body.includes('hrs') || message.body.includes('hours')){
    //const aNewQuote = await quotable.getRandomQuote();
    //console.log(aNewQuote.content)};
    message.reply( 'Fine, I will call you after that!' )}
});