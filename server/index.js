const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config();

const SESSION_FILE_PATH = './session.json'; // Change this to the path where you want to store the WhatsApp session data.

const client = new Client({
  session: require(SESSION_FILE_PATH), // Load the session data from the file if it exists.
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client Ready!');
});

client.on('message', (message) => {
  if (message.body.startsWith('!ask')) {
    const question = message.body.slice(5).trim();
    if (!question) {
      message.reply('Please provide a question after !ask.');
      return;
    }

    runCompletion(question)
      .then((result) => message.reply(result))
      .catch((error) => {
        console.error('Error running OpenAI completion:', error);
        message.reply('Something went wrong while processing your question.');
      });
  }
});

// Function to save the WhatsApp session data to a file.
function saveSession() {
  const sessionData = client.base64EncodedAuthInfo();
  require('fs').writeFileSync(SESSION_FILE_PATH, JSON.stringify(sessionData));
}

client.initialize().then(() => saveSession()).catch((error) => console.error('Failed to initialize:', error));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function runCompletion(message) {
  const maxTokens = 250; // Define an appropriate value based on your model's maximum token limit.
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message,
    max_tokens: maxTokens,
  });
  return response.data.choices[0].text.trim();
}
