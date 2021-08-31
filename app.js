//native node modules
const https = require("https");

//external node modules, installed via npm
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

//Express initialization
//Use ejs
app.set('view engine', 'ejs');

//Use body parser - so you can use req.body.variableName
app.use(bodyParser.urlencoded({
  extended: true
}));

//Use static folder "public"
app.use(express.static("public"));

//Database initialization
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Article Schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Article model for DB
const Article = mongoose.model("Article", articleSchema);

/**************************Requests Targeting all Articles**************************/
//REST for route /articles (GET, POST, DELETE)
app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      res.send("Successfully saved a new article into DB");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles from DB");
    } else {
      res.send(err);
    }
  });
});

/**************************Requests Targeting a Specific Article**************************/
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    } else{
      res.send("No articles matching that title was found!");
    }
  });
})
.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else{
        res.send(err);
      }
    }
  );
})
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted a article.");
      } else {
        res.send(err);
      }
    }
  );
});

//Start server
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started successffuly");
});
