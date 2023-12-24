const express = require('express')
const app = express()
const port = process.env.PORT || 4000
app.get('/get', (req,res)=>{
	res.send('teessssssss')
})

app.listen(port, ()=>{
    console.log(`App Listening on Port ${port}`)
})

module.exports = app