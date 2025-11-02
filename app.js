// Import Express.js
const { json } = require('body-parser');
const express = require('express');

// openai func
// const callOpenAI = require('./callOpenAI');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  //console.log(`\n=== Receive GET request ===\n`)
  //console.log(JSON.stringify(req))
  //console.log(`\n\n`)

  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for GET requests
app.get('/test_ai', (req, res) => {
  console.log(`\n=== Receive GET test_ai request ===\n`)

  callOpenAI()
  res.status(200).end();
});

// Route for POST requests
app.post('/', (req, res) => {
  //console.log(`\n=== Receive POST request ===\n`)
  //console.log(JSON.stringify(req))
  //console.log(`\n\n`)

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});







async function callOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
  }

  const resp = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-nano',
      input: '你好',
      store: true,
    }),
  });

  if (!resp.ok) {
    // 便于排错：把返回文本一起抛出
    const errText = await resp.text().catch(() => '');
    throw new Error(`OpenAI API error: ${resp.status} ${resp.statusText} ${errText}`);
  }

  const data = await resp.json();
  // 需要的话你也可以 console.log(data);
  console.log(data);
  return data;
}
