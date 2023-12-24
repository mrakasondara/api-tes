const express = require('express')
const app = express()

app.get('/get', (req,res)=>{
	res.send('teessssssss')
})

module.exports = app