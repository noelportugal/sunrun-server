const SunRun = require('sunrun-node')
const sunRun = new SunRun({
  phone: process.env.phone,
})
const express = require('express')
const { urlencoded } = require('body-parser');
const app = express()
app.use(urlencoded({ extended: false }));
const port = 3000

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;


app.get('/', async (req, res) => {
  const data = await sunRun.getDailyBriefing()
  if (data.status === 'error'){
    client.messages.create({
     body: data.data,
     from: '+18089004433',
     to: process.env.phone
   })
  }
  res.send(data)
})

app.post('/code', async (req, res) => {
  const data = await sunRun.respondPasswordless(req.body.Body)
  const twiml = new MessagingResponse();
  twiml.message(data.data);
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})