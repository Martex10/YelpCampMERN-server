//this loads all of our environment variables from .env file on to process.env
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comments");
const { loginRequired, ensureCorrectUser } = require("./middleware/auth");
const db = require("./models");

app.set('port', (process.env.PORT || 8081));

app.use(cors());
app.use(bodyParser.json());

//all my routes here 
//prefixed all of routes with /api/auth
app.use("/api/auth", authRoutes);
app.use(
    "/api/users/:id/comments", 
    loginRequired, 
    ensureCorrectUser, 
    commentRoutes
);

app.get("/api/comments", loginRequired, async function(req, res, next){
    try {
        let comments = await db.Comment.find()
            .sort({ createdAt: "desc" })
            .populate("user", {
                username: true,
                profileImageUrl: true
              });
            return res.status(200).json(comments);
    } catch(err){
        return next(err);
    }
});

app.use(function(req, res, next){
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// makes all the errors look the same for the front end
app.use(errorHandler);

app.listen(app.get('port'), function(){
    console.log(`Server is starting on port`, app.get('port'));
});