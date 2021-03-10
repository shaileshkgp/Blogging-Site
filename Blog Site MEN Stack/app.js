const express = require('express');
const bodyParser = require('body-parser');
const methodoveride=require("method-override")
const app=express()

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodoveride("_method"))

app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

//DATABASE SETUP
const mongoose = require('mongoose');
const { Db } = require('mongodb');
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


//MONGOOSE SCHEMA + MODELLING
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    Created:{type: Date,default:Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Blog1",
//     image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
//     body:"Hello this is blog post"
// })

//Restful routing

//BASIC ROUTE 
app.get('/',(req,res)=>{
    res.redirect("/blogs");
})


app.get('/blogs',(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err)
        {
          console.log(err)
        }
        else
        {
            res.render("index",{blogs:blogs});
        }
    })
    
})

// New route
app.get("/blogs/new",(req,res)=>{
    res.render("new");
})

//Create Route
app.post("/blogs",(req,res)=>{
   Blog.create(req.body.blog,(err,newBlog)=>{
       if(err)
       {
        res.render("new");
       }
       else
       {
           res.redirect("/blogs");
          // console.log(newBlog);
       }
   })
    
})

//Show route
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err)
        {
         res.redirect("/blogs");
        }
        else
        {
            res.render("show" , {blog: foundBlog})
            //console.log(foundBlog);
        }
    })
     
 })


 //EDIT ROUTE
 app.get('/blogs/:id/edit',(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err)
        {
         res.redirect("/blogs");
        }
        else
        {
            res.render("edit" , {blog: foundBlog})
            //console.log(foundBlog);
        }
    })
 })

//UPDATE ROUTE
app.put('/blogs/:id',(req,res)=>{
   // Blog.findByIdAndUpdate(id,newdata,callback)
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,Upadteddata)=>{
       if(err)
       {
           console.log("error")
       }
       else
       {
           res.redirect("/blogs/"+ req.params.id)
       }
   })
})

//DELETE
app.delete('/blogs/:id',(req,res)=>{
    //destroy blog
    //redirect somewhere
    Blog.findOneAndRemove(req.params.id,(err)=>{
        if(err)
        {
              res.redirect("/blogs")
        }
        else
        {
            res.redirect("/blogs")
        }
    })

})

app.listen(5555,()=>{
      console.log("server running on 5555!")
})