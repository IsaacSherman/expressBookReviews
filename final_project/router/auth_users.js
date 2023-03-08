const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    console.log(username);
return users.find(user=>user.name === username) === undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const user = users.find(x=>x.name === username);
if(user){
    console.log(password);
    return user.password === password;
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
user = users.find(req.body.name);
if(!user)
    return res.status(404).json({message: "User not found"});
if(user.password !== req.body.password){
    return res.status(300).json({message: "Login failed"});
}
    return res.status(200).json({message:"You logged in!  No idea what you were trying to do here..."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {


    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
