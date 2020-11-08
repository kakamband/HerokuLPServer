const express = require('express');
const PORT = process.env.PORT || 5000;

const app = express()

app.get('/', (req, res) => {
  res.json( { result: "ok?"} )
})

app.listen(5000, () => {
    console.log('server started on port 5000')
  })