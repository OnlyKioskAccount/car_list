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

app.use('/retrieve',(req,res,next)=>{
    res.set({
        "Access-Control-Allow-Origin":"http://localhost:8080",
        "Access-Control-Allow-Headers":"Content-Type"
    })
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "SELECT * FROM `car_info`"
    connection.query(sql,(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json([true,results])
        }
    })
})
app.use('/update',(req,res,next)=>{
    res.set({
        "Access-Control-Allow-Origin":"http://localhost:8080",
        "Access-Control-Allow-Headers":"Content-Type"
    })
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "UPDATE `car_info` SET `brand`=?, `model`=?, `engine`=?, `gearbox`=? WHERE `car_info_id`=?"
    connection.query(sql,[req.body.brand,req.body.model,req.body.engine,req.body.gearbox,req.body.car_info_id],(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json([true])
        }
    })
})
app.use('/create',(req,res,next)=>{
    res.set({
        "Access-Control-Allow-Origin":"http://localhost:8080",
        "Access-Control-Allow-Headers":"Content-Type"
    })
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "INSERT INTO `car_info` SET ?"
    connection.query(sql,req.body,(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json([true,results.insertId])
        }
    })
})
app.use('/delete',(req,res,next)=>{
    res.set({
        "Access-Control-Allow-Origin":"http://localhost:8080",
        "Access-Control-Allow-Headers":"Content-Type"
    })
    var mysql = require('mysql')
    var connection = mysql.createConnection(config)
    var sql = "DELETE FROM `car_info` WHERE `car_info_id` = ?"
    connection.query(sql,[req.body.car_info_id],(err,results,fields)=>{
        connection.end()
        if(err){
            next(err)
        }else{
            res.json([true])
        }
    })
})
app.use((req,res,next)=>{res.send('Sorry, cannot recognize '+req.url)})
app.use((err,req,res,next)=>{
    res.json([false,err.message])
})

const port = process.env.port || 3000
app.listen(port,()=>{console.log('app run @ '+port)})
