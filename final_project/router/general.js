const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
    let username = req.body.user.username;
    let password = req.body.user.password;
    if(!username || username === ""){
        return res.status(300).json({message: "Username required"});
    }
    if(!password || password === ""){
        return res.status(301).json({message: "Password required"});
    }
        user = {"name": username,
            "password":password};
    if(users.find(x=>x.name === username)){
        return res.status(299).json({message: "User already registered"});
    }
    users.push(user);
    return res.status(200).json({message: "User " + username + " added", users});
});

const getBooks = async()=>{
    return books;
}

// Get the book list available in the shop
public_users.get('/', async (req, res)=> {
    const response = await getBooks();
    return res.status(200).json(response);
});

const getBookByIsbn= async (isbn) => {
    book = books[isbn];
    return book;
}

const getBooksByAuthor= (author)=>
{
    results = [];
    for(key in books){
        book = books[key];
        if(book["author"]===author)
            results.push(book);
    }
    if(results.length === 0) 
        return undefined;
    return results;
}

const getBooksByTitle= (title)=>{
    results = [];
    for(key in books){
        book = books[key];
        if(book["title"]===title)
            results.push(book);
    } 
    return results;
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res)=> {
    new Promise((resolve, reject)=> {
        let book = getBookByIsbn(req.params.isbn);
        if(book)
            resolve(book);
        else
            reject(book);
    }).then((success=>{
        res.send(JSON.stringify(success, null, 2));
    })).catch(err=>{
        res.send(err);
    });
    // if (!promise)
    //     return res.status(404).json({message: "Book not found"});
    // return res.status(200).json(promise);
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) =>{
    new Promise((resolve, reject)=> {
        let author = req.params.author;
        let books = getBooksByAuthor(author);
        if(books)
            resolve(books);
        else
            reject({"message": "No books by that author (" + author + ")."});
    }).then((success=>{
        res.send(JSON.stringify(success, null, 2));
    })).catch(err=>{
        res.send(err);
    }).finally(()=>console.log("Done"));
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject)=> {
        let title = req.params.title;
        let books = getBooksByTitle(title);
        console.log(books);
        if(books.length > 0)
            resolve(books);
        else
            reject({"message": "No books by that title (" + title + ")."});
    }).then((success=>{
        res.send(JSON.stringify(success, null, 2));
    })).catch(err=>{
        res.send(err);
    });
    // results = [];
    // for(key in books){
    //     book = books[key];
    //     if(book["title"]===req.params.title)
    //         results.push(book);
    // } 
    // return res.status(200).json(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    book = books[req.params.isbn];
    if (!book)
      return res.status(404).json({message: "Book not found"});
    return res.status(200).json(book["reviews"]);
});

module.exports.general = public_users;
