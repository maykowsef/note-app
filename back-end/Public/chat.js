const express = require('express');
const router = express.Router();
const connection = require('../server');

const app = express();
const port = 3001;

const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: ""
  });

const openai = new OpenAIApi(config);

router.post('/message', (req, res) => {
  const prompt=req.body.prompt;
console.log(prompt)
const response = openai.createCompletion({
  model: 'text-davinci-003',
  prompt: prompt,
  temperature: 0,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  max_tokens: 256
  });


response.then((data) =>  {
  res.send({ message: data.data.choices[0].text})
  }).catch((err) => {
  res.send({ message: err })
  })

});


module.exports = router;
