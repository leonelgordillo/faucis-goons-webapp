require('dotenv').config();
const express = require('express');
const apiRouter = require('./api-router');
const app = express(),
      bodyParser = require("body-parser");
      port = 8080;
    


app.use(bodyParser.json());
app.use(express.static(process.cwd()+`/dist/Hackathon2020/`));
app.get('*', (req,res) => {
  res.sendFile(process.cwd()+`/dist/Hackathon2020/index.html`)
});
app.use('/api', apiRouter()) 

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
