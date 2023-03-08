const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.user.name;
    let password = req.body.user.password;
    user = {"name": username,
            "password":password};
    if(users.find(x=>x.name === username)){
        return res.status(299).json({message: "User already registered"});
    }
    users.push(user);
    return res.status(200).json({message: "User " + username + " added"});
});

// Get the book list available in the shop
public_users.get('/',(req, res)=> {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',(req, res)=> {
  //Write your code here
  book = books[req.params.isbn];
  if (!book)
    return res.status(404).json({message: "Book not found"});
  return res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
results = [];
for(key in books){
    book = books[key];
    if(book["author"]===req.params.author)
        results.push(book);
}
    return res.status(200).json(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
