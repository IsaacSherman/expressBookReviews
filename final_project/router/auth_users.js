const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [        {
    "name": "Kidu",
    "password": "bob1234"
},
{
    "name": "Gil",
    "password": "bob1234"
}
];

const isValid = (username)=>{ //returns boolean
    console.log(username);
return users.find(user=>user.name === username) === undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const user = users.find(x=>x.name === username);
if(user){
    console.log(user, username, password);
    return user.password === password;
}
return false;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    username = "no username"
    user = users.find(x=>x.name === req.body.user.name);
    if(user){
        if(authenticatedUser(user.name, user.password)){
            let accessToken = jwt.sign({
                data: user.password
            }, 'access', { expiresIn: 60 * 60 });
        username = user.name;
            req.session.authorization = {
                accessToken,username
            }
        return res.status(200).json({message:"You logged in ", user});
        }
        return res.status(403).json({message: "Password incorrect"});
    }
    body = req.body;
        return res.status(404).json({message: "User not found:", username});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let username = "";
    const book = books[req.params.isbn];
    if(!book){
        return res.status(403).json({
            message: "Book not found (id = " + req.params.isbn + ")"
        });
    }
    if(req.session.authorization){
        token = req.session.authorization['accessToken'];
        status = "User not logged in";
        jwt.verify(token, "access", (err, user)=>{
            if(!err){
                book.reviews[req.session.authorization.username] = req.query.review;
                status = "Review added/updated successfully";
            }
                
        });
    }
    if(status)
        return res.status(200).json({message: status});
    return res.status(403).json({message:status});
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if(!book){
        return res.status(403).json({
            message: "Book not found (id = " + req.params.isbn + ")"
        });
    }
    if(req.session.authorization){
        token = req.session.authorization['accessToken'];
        status = "User not logged in";
        statusnum = 403;
        jwt.verify(token, "access", (err, user)=>{
            if(!err){
                let target = req.session.authorization.username;
                if(book.reviews[target])
                    {
                        delete book.reviews[target];
                        status = "Review deleted successfully";
                    }
                    else{
                        status = "That user doesn't have a review to delete";
                    }
                statusnum = 200;
            }else{
                status = "Login failed";
            }
        });
    }
    return res.status(statusnum).json({message:status});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
