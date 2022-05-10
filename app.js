
require('dotenv').config()
const cors = require('cors')
const axios = require('axios')
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())
// Models
const User = require('./models/User')
// Public Route
app.get("/", async (req, res) => {
    
    const id = req.params.id
    const userAll = await User.find(id)
    
    if(!userAll){
        return res.status(404).json({message: 'Nenhum usuario foi encontrado!'})  
    }
    try {
        res.status(200).json(userAll)
    } catch (error) {
        res.status(500).json({message: "Aconteceu um erro no servidor, tente em alguns minutos!"})
    }
})

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {

    const id = req.params.id

    //check if user exists
    const user = await User.findById(id, '-password')
    if(!user) {
        return res.status(404).json({message: 'Usuario não encontrado!'})
    }
    res.status(200).json({ user })
})

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({message: 'Acesso negado!'})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
        
    } catch (error) {
        res.status(400).json({message: "Token inválido!"})
    }
}
// Register User
app.post('/auth/register', async(req, res)=> {   
    const {name, mail, password, confirmPassword} = req.body

    //validations
    if(!name){
        return res.status(422).json({message: 'O nome é obrigatório!'})
    }
    if(!mail){
        return res.status(422).json({message: 'O e-mail é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({message: 'O senha é obrigatório!'})
    }
    if(password !== confirmPassword){
        return res.status(422).json({message: 'As senhas não conferem!'})
    }

    //check if user exists
    const userExists = await User.findOne({mail: mail})
    if (userExists) {
        return res.status(422).json({message: 'Por favor utilize outro email!'})
    }
    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        mail,
        password: passwordHash,
    })

    try {

       await user.save()
       
       res.status(201).json({message: "Usuário criado com sucesso!"})
        
    } catch (error) {
        console.log(error)

        res.status(500).json({message: "Aconteceu um erro no servidor, tente em alguns minutos!"})
    }
})
// Login User
app.post("/auth/login", async (req, res) => {

    const {mail, password} = req.body

    //validations
    if(!mail){
        return res.status(422).json({message: 'O e-mail é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({message: 'A senha é obrigatório!'})
    }
    //check if user exists
    const user = await User.findOne({mail: mail})

    if (!user) {
        return res.status(404).json({message: 'Usuário não encontrado!'})
    }

    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({message: 'Senha inválida!'})
    }


    try {
        
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user.id,
            },
            secret,
        
        )

        res.status(200).json({message: "Autenticação realizada com sucesso"})

    } catch (error) {
        console.log(error)

        res.status(500).json({message: "Aconteceu um erro no servidor, tente em alguns minutos!"})
    }
})

app.delete("/user/:id", async (req, res) => {

    const id = req.params.id
    console.log(id)

    const user = await User.findById(id, '-password')
    if(!user) {
        return res.status(404).json({message: 'Usuario não encontrado!'})
    }
    try {
        await user.delete()
        
        res.status(201).json({message: `Usuário ${id} deletado com sucesso!`})        
     } catch (error) {

         console.log(error)
         res.status(500).json({message: "Aconteceu um erro no servidor, tente em alguns minutos!"})
     }
    
})

//Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@apiauthcluster.lrkqi.mongodb.net/api2AuthJWT?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))

