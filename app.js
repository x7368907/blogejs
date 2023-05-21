//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent ="嗨，很高興能夠和你分享我的面試經歷。我是一位具有網頁開發背景的前端工程師。我對網頁開發充滿熱情，我具備的前端技能，包括HTML、CSS和JavaScript。我熟悉常用的前端框架，如Vue.js，並能夠運用這些框架來開發具有高度互動性和優秀用戶體驗的網站，以下是我面試過的一些公司，分享給想轉職前端的夥伴參考，希望大家都能順利轉職成功，一起朝軟體工程師的方向努力";
const aboutContent = "我叫李志仁，對於網頁開發擁有濃厚興趣，並熱愛學習的前端開發者，具有1年左右經驗，專注於開發和維護具有高互動性的網站。熟練掌握HTML、CSS、JavaScript，並擅長使用Vue前端框架。對寫出高維護性的程式碼充滿熱忱，致力於不斷學習最佳實踐並提升技能水平。除了技術能力，我還重視不斷學習和成長。我經常追蹤最新的前端發展趨勢，參加技術研討會和工作坊，並努力保持自己的技能與行業最佳實踐保持同步。";
const contactContent = "在我的經歷中，我曾參與過的項目：1. 物流Web app開發 2.活動網站開發，我喜歡和團隊合作，並能夠有效地與設計師、後端工程師和產品經理協作。我擁有解決問題的能力，並在壓力下能夠保持冷靜並交付高質量的工作。";
const app = express();





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1/blogDB",{useNewUrlParser: true});

const {Schema} = mongoose;

const postSchema = new Schema( {
  title:String,
  content:String,
});

const Post = mongoose.model("Post",postSchema);




app.get("/",function(req,res ) {
    Post.find().exec()
    .then((posts) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch((e) => {
      console.log(e);
    })    
});

app.get("/about", function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
})

app.post("/compose", function(req,res){

  const post = new Post( {
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // posts.push(post);
  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch((e) => {
    console.log(e);
  })
     

 
});
app.get("/posts/:postId", (req,res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId}).exec()
  .then((post) => {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  }).catch((e) => {
    console.log(e);
  })
});


// app.get("/posts/:postName",function(req,res){
//   const requestedTitle = _.lowerCase(req.params.postName);

//   posts.forEach(function(post){
//     const storedTitle =_.lowerCase(post.title);

//     if(storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.content
//       });
//     }
//   });
// });











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
