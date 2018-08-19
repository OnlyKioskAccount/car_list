const express = require('express')
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
var config = {
    host:'localhost',
    port:'8889',
    user:'root',
    password:'root',
    database:'car'
}

app.get('/',(req,res,next)=>{res.send('Welcome to Express!')})

app.use('/cors',(req,res,next)=>{
    res.set({
        "Access-Control-Allow-Origin":"http://localhost:8080",
        "Access-Control-Allow-Headers":"Content-Type"
    })
    res.json({
        feedback:"hello from express /cors",
        msg:req.body.msg
    })
})

app.use('/retrieve',(req,res,next)=>{
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "SELECT * FROM `car_info`"
    connection.query(sql,(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json(results)
        }
    })
})
app.use('/update',(req,res,next)=>{
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "UPDATE `car_info` SET `gearbox`= ? WHERE `brand`=?"
    connection.query(sql,[req.body.gearbox,req.body.brand],(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json(results)
        }
    })
})
app.use('/create',(req,res,next)=>{
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)

    var sql = "INSERT INTO `car_info` SET ?"
    connection.query(sql,req.body,(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json(results)
        }
    })
})
app.use('/delete',(req,res,next)=>{
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "DELETE FROM `car_info` WHERE ?? = ?"
    connection.query(sql,[req.body.fieldname,req.body.fieldvalue],(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json(results)
        }
    })
})
app.use((req,res,next)=>{res.send('Sorry, cannot recognize '+req.url)})
app.use((err,req,res,next)=>{
    res.json([err.message])
})

const port = process.env.port || 3000
app.listen(port,()=>{console.log('app run @ '+port)})
