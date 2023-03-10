const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const loggedIn = (username, session)=>{
    signedIn = false;
    if(session.authorization) { //get the authorization object stored in the session
        token = session.authorization['accessToken']; //retrieve the token from authorization object
        jwt.verify(token, "access",(err,user)=>{ //Use JWT to verify token
            signedIn = !err;
        });
    }
        return signedIn;
}

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
user = users.find(x=>x.username === req.body.name);
if(isValid(user)){
    if(authenticatedUser(user.username, user.password)){
        let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60 * 60 });
      
          req.session.authorization = {
            accessToken,username
        }
    }
}
if(!user)
    return res.status(404).json({message: "User not found"});
if(user.password !== req.body.password){
    return res.status(300).json({message: "Login failed"});
}
    return res.status(200).json({message:"You logged in!  No idea what you were trying to do here..."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
if(req.session.authorization.accessToken === jwt.verify())
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
