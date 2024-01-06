const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const cloudinary = require('cloudinary')

const app = express()
const Post = require('../Post')
const User = require('../User')
const port = process.env.PORT || 4000

app.use(cors({credentials: true, origin: 'https://blog-titik-game.vercel.app'}))
// const uploadMiddleware = multer({dest: 'uploads/'})
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/uploads'));

cloudinary.config({
    cloud_name:'dxs0jt3xe',
    api_key: '531926252978129',
    api_secret:'DuGN2Yq0sYUfzvCDnAQf9nLhIV4',
})

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
	res.json(await Post.find()
        .populate('author',['username'])
        .sort({createdAt: -1})
        .limit(20))
})

app.get('/highlight', async (req,res)=>{
    mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
    const posts = await Post.find().populate('author',['username'])
    res.json(posts)
})

app.post('/upload', async(req,res)=>{
    const {originalname,path} = req.file
    cloudinary.uploader.upload(path).then(result=>{
        res.json(result)
    })
})

app.listen(port, ()=>{
    console.log(`App Listening on Port ${port}`)
})

module.exports = app
