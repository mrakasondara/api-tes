const express = require('express')
const mongoose = require('mongoose')
const app = express()
const Post = require('../Post')
const port = process.env.PORT || 4000


app.get('/get', (req,res)=>{
	res.send('teessssssss')
})

app.get('/post', async(req,res)=>{
	mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
	res.json(await Post.find())
})

app.listen(port, ()=>{
    console.log(`App Listening on Port ${port}`)
})

module.exports = app