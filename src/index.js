const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cloudinary = require('cloudinary').v2
const app = express()
const Post = require('../Post')
const User = require('../User')
const port = process.env.PORT || 4000

app.use(cors())
app.use(cors({credentials: true, origin: 'https://blog-titik-game.vercel.app'}))
const salt = bcrypt.genSaltSync(10)
const secret = '1dhds9sdfs982snqwiqdh'
app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
    filename: function(req,file,cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage:storage})

cloudinary.config({
    cloud_name:'dxs0jt3xe',
    api_key: '531926252978129',
    api_secret:'DuGN2Yq0sYUfzvCDnAQf9nLhIV4',
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

app.post('/login',async (req,res)=>{
    const {username,password} = req.body
    mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
    const loginCheck = await User.findOne({username})
    if(loginCheck === null){
        res.status(400).json()
    }else{
        const passOk = bcrypt.compareSync(password,loginCheck.password)
        if(passOk){
            jwt.sign({username, id:loginCheck._id},secret,{}, (err,token)=>{
                if(err)throw(err)
                res.cookie('token',token).json({
                    id: loginCheck._id,
                    username
                })
            })
        }else{
            res.status(400).json()
        }
    }

})


app.get('/profile', (req,res)=>{
    const {token} = req.cookies
    if(token){
        jwt.verify(token,secret,{},(err,info)=>{
            if(err)throw err
            res.json(info)
        } )
    }
})

app.post('/logout', (req,res)=>{
    res.cookie('token','').json('logout')

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

const addBlog = (token,title,summary,tag,path,content)=>{
    jwt.verify(token,secret,{}, async (err,info)=>{
        if(err)throw err;
            let newName
            cloudinary.uploader.upload(path, {folder: 'uploads'}).then(result=>{
                newName = result.public_id + '.' + result.format
            })
            mongoose.connect("mongodb+srv://rakasondara21:rakasondara21@project.ezg1faq.mongodb.net/?retryWrites=true&w=majority")
            postDoc = await Post.create({
                title,
                summary,
                tag,
                thumbnail:newName,
                content,
                author:info.id,
            })
    })

}

app.post('/createpost', upload.single('file') ,(req,res)=>{
    if(req.file === undefined){
        res.status(400).json('Mohon isi thumbnail')
    }else{
        const {originalname,path} = req.file
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        const lowerExt = ext.toLowerCase()
        let postDoc
        const {title,summary,tag,content} = req.body
        const {token} = req.cookies
        switch(lowerExt){
            case 'jpg':
            addBlog(token,title,summary,tag,path,content)
            res.status(200).json(postDoc)
            break;
            case 'jpeg':
            addBlog(token,title,summary,tag,path,content)
            res.status(200).json(postDoc)
            break;
            case 'png':
            addBlog(token,title,summary,tag,path,content)
            res.status(200).json(postDoc)
            break;
            case 'webp':
            addBlog(token,title,summary,tag,path,content)
            res.status(200).json(postDoc)
            break;
            default:
            res.status(400).json('image only')
        }
    }
})

app.get('/detailpost/:id', async(req,res)=>{
    const {id} = req.params
    try{
        const detail = await Post.findById(id).populate('author',['username'])
        res.json(detail)
    }catch(e){
        res.status(404).json(e)
    }
    
})

app.listen(port, ()=>{
    console.log(`App Listening on Port ${port}`)
})

module.exports = app