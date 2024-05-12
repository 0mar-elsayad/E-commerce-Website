
const router = express.Router();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors = require('cors');
const { type } = require('os');


//shema creating for user model 
const users = mongoose.model('users', {
    name: {
        type:String,
        
    },
    email: {
        type: String,
        unique:true,

    },
    password: {
        type:String,
    },
    cartData: {
        type:Object,
    },
    date: {
        type: Date,
        default:Date.now,

    }
    
})
//creating endpoint for registring the user


// Endpoint for registering the user
router.post('/signup', async (req, res) => {
    try {
        const check = await User.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // Create the user with hashed password
        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
        });
        await user.save();

        const data = {
            user: { id: user.id }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, error: "Failed to register user" });
    }
});

//creating endpoint for user login
router.post('/login', async (req, res) => {
    let user = await users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "wrong password" });

        }
    }
    else {
        res.json({ success: false, errors: "wrong email id" });
    }

})

//creating endpoint for new collection
router.get('/newcollections', async (req , res) => {

    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

//endpoint for popular in women section
router.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
    
})

//creating middleware to fetch user
    const fetchUser = async (req, res, next) =>{
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({ errors: "please authenticate using valid token" })
        }
        else {
            try {
                const data = jwt.verify(token, 'secret_ecom');
                req.user = data.user;
                next();
            }
            catch (error) {
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
}

//creating endpoint for adding products in cartdata
router.post('/addtocart',fetchUser, async (req, res)=>{
    console.log("added", req.body.itemId);
    let UserData = await users.findOne({ _id: req.user.id });
    UserData.cartData[req.body.itemId] += 1;
    await users.findByIdAndUpdate({ _id: req.user.id }, { cartData: UserData.cartData });
    res.send("Added")

})


//creating endpoint to remove product from cartdata

router.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let UserData = await users.findOne({ _id: req.user.id });
    if(UserData.cartData[req.body.itemId]>0)
    UserData.cartData[req.body.itemId] -= 1;
    await users.findByIdAndUpdate({ _id: req.user.id }, { cartData: UserData.cartData });
    res.send("Removed")


})

//creating endpoint to get cartdata
router.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})





module.exports = router;
