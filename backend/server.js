require('dotenv').config();
const express = require('express');
const apiRouter = require('./api-router');
const app = express(),
  bodyParser = require("body-parser");
port = 8080;


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Header");
  res.header("Access-Control-Allow-Credentials", true);
  next();
})

app.use(bodyParser.json());
app.use('/api', apiRouter())
app.use(express.static(process.cwd() + `/dist/Hackathon2020`));
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + `/dist/Hackathon2020/index.html`)
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
