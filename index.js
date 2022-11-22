const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const user=[];
app.get('/',(req,res)=>{
    res.json(user)
})
app.post('/user',jsonParser,async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt();
        console.log(salt);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        console.log(hashedPassword);
        console.log(req.body);
        const user = {name:req.body.name,password:hashedPassword,salt:salt}
        user.push(user)
        res.status(201).send();

    }catch{
        console.log("something went wrong");
        res.status(500).send()
    }
})
app.post('/user/log-in',jsonParser,async(req,res)=>{
    const user = user.find(user=>user.name=req.body.name);
    if(user == null){
        return res.status(400).send("No user exists")
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.status(200).send("Login Successfull")
        }else{
            res.send("Wrong Password")
        }
    }catch{
        res.status(500).send("Internal Server Error")
    }
})
app.listen(process.env.PORT||9000,()=>{
    console.log("//////");
})