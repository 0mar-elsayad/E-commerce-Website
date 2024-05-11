const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const { type } = require('os');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://kareemToson:kareemtoson123@cluster0.tr43lhr.mongodb.net/webApp?retryWrites=true&w=majority&appName=Cluster0");

app.get('/', (req, res) => {
    res.send("Express app is running");
});



const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage:storage });

// Create an upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});
//create schema for creating products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1; // <-- Corrected
    } else {
        id = 1;
    }

    try {
        const newProduct = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price
        });
        await newProduct.save();
        console.log("Product saved:", newProduct);
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, error: "Failed to save product" });
    }
});

//creating api for deleting products

app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log('Product removed');
        res.json({ success: true, name: req.body.name });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, error: "Failed to remove product" });
    }
});
//creating api for getting all products
app.get('/allproducts', async (req, res)=>{
let products=await Product.find({});
console.log('all Products fetched');
res.send(products);
})


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
app.post('/signup', async (req, res) => {
    let check = await users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new users({
        name:req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData:cart,

    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true,token})
})


//creating endpoint for user login
app.post('/login', async (req, res) => {
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
app.get('/newcollections', async (req , res) => {

    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

//endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
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
app.post('/addtocart',fetchUser, async (req, res)=>{
    console.log("added", req.body.itemId);
    let UserData = await users.findOne({ _id: req.user.id });
    UserData.cartData[req.body.itemId] += 1;
    await users.findByIdAndUpdate({ _id: req.user.id }, { cartData: UserData.cartData });
    res.send("Added")

})


//creating endpoint to remove product from cartdata

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let UserData = await users.findOne({ _id: req.user.id });
    if(UserData.cartData[req.body.itemId]>0)
    UserData.cartData[req.body.itemId] -= 1;
    await users.findByIdAndUpdate({ _id: req.user.id }, { cartData: UserData.cartData });
    res.send("Removed")


})

//creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})










app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
