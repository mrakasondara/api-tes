const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const app = express()
const Post = require('../Post')
const User = require('../User')
const port = process.env.PORT || 4000

app.use(cors({credentials: true, origin: 'https://blog-titik-game.vercel.app'}))
// const uploadMiddleware = multer({dest: 'uploads/'})
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads'));


app.get('/get', (req,res)=>{
	res.send('teessssssss')
})

app.post('/register', async (req,res)=>{
	mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
	const {fullname,username,password} = req.body
    try{
        const create = await User.create({fullname,username,password:bcrypt.hashSync(password,salt)})
        res.json(create)
        console.log(create)
    }catch(e){
        console.log(e)
        res.status(400).json(e)
    }
})

app.get('/post', async(req,res)=>{
	mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
	res.json(await Post.find())
})

app.get('/highlight', async (req,res)=>{
    mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
    const posts = await Post.find().populate('author',['username'])
    res.json(posts)
})

app.listen(port, ()=>{
    console.log(`App Listening on Port ${port}`)
})

module.exports = app
