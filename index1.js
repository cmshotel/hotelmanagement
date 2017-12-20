const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express().get('/', (req, res) => res.render('html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
