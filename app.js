const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const err = require("express");


// TODO add you db config
const db = new Sequelize({
    dialect: 'mssql',
    database: 'Products',
    username: 'sa',
    host: 'localhost',
    port: '1433',
    password: '123123',
    validateBulkParameters: true,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})

let FoodItem = db.define('foodItem', {
    name : Sequelize.STRING,
    category : {
        type: Sequelize.STRING,
        validate: {
            len: [3, 10]
        },
        allowNull: false
    },
    calories : Sequelize.INTEGER
},{
    timestamps : false
})


const app = express()
// TODO
app.use(bodyParser.json());

app.get('/create', async (req, res) => {
    try{
        await db.sync({force : true})
        for (let i = 0; i < 10; i++){
            let foodItem = new FoodItem({
                name: 'name ' + i,
                category: ['MEAT', 'DAIRY', 'VEGETABLE'][Math.floor(Math.random() * 3)],
                calories : 30 + i
            })
            await foodItem.save()
        }
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})
    }
})

app.get('/food-items', async (req, res) => {
    try{
        let foodItems = await FoodItem.findAll()
        res.status(200).json(foodItems)
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})        
    }
})

app.post('/food-items', async (req, res) => {
    try{
        // TODO
        if(Object.keys(req.body).length !== 0)
        {
            if(!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('category') || !req.body.hasOwnProperty('calories')) 
            {
                return res.status(400).json({message : 'malformed request'})
            }
            else if(req.body.calories < 0) 
            {
                return res.status(400).json({message : 'calories should be a positive number'})
            }
            else if(req.body.category.length <3 || req.body.category.length > 10)
            {
                return res.status(400).json({message : 'not a valid category'})
            }
            return res.status(201).json({message: 'created'})
        }
        else 
        {
            return res.status(400).json({message : 'body is missing'})
        }
    }
    catch(err){
        return err.message;
    }
})

module.exports = app