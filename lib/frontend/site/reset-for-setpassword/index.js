var express = require('express')

var app = module.exports = express()

app.get('/setpassword/reset/:id', require('lib/frontend/site/layout'))