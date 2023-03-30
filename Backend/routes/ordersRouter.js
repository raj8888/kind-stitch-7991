const {OrdersModel} = require("../models/ordersModel");
const express = require("express");
require('dotenv').config()
let {get_date,get_time}=require("../utils/utils")
const {ClassesModel} = require("../models/ClassesModel");


const ordersRouter = express.Router();

// Order Page
ordersRouter.get("/",(req,res)=>{
    res.status(200).send({message:"Orders Page"})
})

// Orders - Get All Orders
ordersRouter.get("/all", async (req,res)=>{
    try{
        let orders = await OrdersModel.find();
        res.status(200).send({message:"Orders Data Fetched",orders})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// orders - Single orders Detail
ordersRouter.get("/:id", async (req,res)=>{
    let ordersID= req.params.id;
    try{
        let orders = await OrdersModel.findById(ordersID);
        res.status(200).send({message:"Order Fetched",orders})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})


//all orders of single users
ordersRouter.get("/user/:id", async (req,res)=>{
    let userID= req.params.id;
    try{
        let orders = await OrdersModel.find({userID});
        res.status(200).send({message:"Orders Fetched",orders})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})

// Order creation
ordersRouter.post("/create", async (req,res)=>{
    let payload = req.body;
    payload.status=true;
    payload.createdDate=get_date();
    payload.createdTime=get_time();
    let classID = payload.classID;
    try{
        let classes = await ClassesModel.findOne({_id:classID});
        console.log(classes,classID)
        if(classes.clients.includes(payload.userID)){            
            res.status(401).send({message:"You have already registered for this class"})
        }else{
            if(classes.seatOccupied < classes.seatTotal){
                let order = new OrdersModel(payload);
                await order.save();
                await ClassesModel.findByIdAndUpdate({_id:classID},{seatOccupied:classes.seatOccupied+1,clients:[...classes.clients,payload.userID]}) // increment seats occupied
                res.status(200).send({message:"Order created",order})
            }else{
                res.status(401).send({message:"All seats are Booked"})
            }
        }
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})


// Order status Update (true or false)
ordersRouter.patch("/update/:id", async (req,res)=>{
    let orderID= req.params.id;
    try{
        let order = await OrdersModel.findByIdAndUpdate(orderID,{status:false});        
        res.status(200).send({message:"Order Status updated"})
    }catch(error){
        res.status(400).send({message:"Something went wrong",error:error.message})
    }
})




module.exports= {ordersRouter}