const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const moment= require('moment') 
process.env.SECRET_KEY = 'secret'


var Constants = Object.freeze({
  SIGNUP_SUCCESS: {code: 0, message: 'You have been registered succesfully!'},
  USER_ALREADY_REGISTERED: {code: 1, message: 'The user already exists, please choose another email'},
  SIGNUP_ERROR: {code: 2, message: 'The process has failed, plesae try again later.'},
  SIGNUP_ERROR_EMAIL_NOT_VALID: {code :3, message: "Email is not in the valid form, please use : something@something.something"},
  SIGNUP_ERROR_PASSWORD_LENGTH :{code :4, message : "Password must be at least 6 chars long."},
  NO_USER_FOUND :{code : 1, message: "No such user exists!"},
  USER_FOUND : {code :0},
  WRONG_PASSWORD : {code : 2, message: "Wrong password!, please try again."},
  SIGNIN_ERROR : {code : 3, message: "Couldn't signed in, please try again later."},
  SAVE_ERROR : {code : 1, message :"Couldn't make changes to settings."},
  SAVE_ERROR_MAIL_TAKEN : {code : 2, message :"Email is already taken by another user"},
  SAVE_ERROR_MAIL_SAME : {code : 3, message :"Email is already taken by another user"},
  SAVE_SUCCESS : {code :0 , message :"Changes have been made succesfully!"},
  POST_ERROR : {code : 1, message :"An error occured while posting, please try again soon."},
  GENERAL_ERROR : {code:-1 , message: "An uknown error has occured, we are on it!"},
  EMPTY_SEARCH : {code :1, message : "Please enter a valid email to search for."}
});


router.get('/searchUser/:email',
async(req,res) =>{
  const email = req.params.email
  if (email === '')
    res.json(Constants.EMPTY_SEARCH)
          try {
            let user = await User.findOne({email:email})
            if (!user){
               res.json({code: Constants.NO_USER_FOUND})
            } else {
            res.json({user:user, code : Constants.USER_FOUND})
            }
      } catch (e) {
          console.error(e);
          res.json(Constants.GENERAL_ERROR)
    }
  }
);

/**
 * @method - POST
 * @param - /none
 * @description - User login route
 */

router.post("/post",
    async (req, res) => {
        const {post,email} = req.body;
        try {
            newPost = new Post({
                post,
                email,
            });
            var date = new Date();
            var formattedDate = moment(date).format('DD/MM/YYYY');
            newPost.createdAt = formattedDate
            newPost.id = newPost._id
            newPost.likesNum = 0
            await newPost.save();
            let user = await User.findOne({
              email : email
          });
          
          user.posts.push(newPost._id)
          user.save()
        } catch (err) {
            console.log(err.message);
            res.status(500).send(Constants.POST_ERROR);
        }
    }
);
  
/**
 * @method - POST
 * @param - none
 * @description - User SignUp route
 */

router.post("/signup",
    async (req, res) => {
      var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
        const {first_name,last_name, email, password,gender} = req.body;
        if (!email.match(reEmail)) return res.json(Constants.SIGNUP_ERROR_EMAIL_NOT_VALID);
        if (password.length <6) return res.json(Constants.SIGNUP_ERROR_PASSWORD_LENGTH);
        try {
            let user = await User.findOne({
                email : email
            });
            if (user) {
               return res.json(Constants.USER_ALREADY_REGISTERED)
            }
            user = new User({
                first_name,
                last_name,
                email,
                password,
                gender

            });
            var date = new Date();
            var formattedDate = moment(date).format('DD/MM/YYYY');
            user.createdAt = formattedDate
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt), (error,hash)=>{
                if (error) res.json(Constants.SIGNUP_ERROR)
            }
            await user.save();
            res.json(Constants.SIGNUP_SUCCESS)
        } catch (err) {
            console.log(err.message);
            res.josn(Constants.GENERAL_ERROR);
        }
    }
);

router.post("/login",
    async (req, res) => {
        const { email, password } = req.body;
            try {
                let user = await User.findOne({email:email});
                if (!user)
                    return res.json(Constants.NO_USER_FOUND)
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch)
                  return res.json(Constants.WRONG_PASSWORD)
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                  }
                  let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 10
                  })
                  var tokenizedMsg = {msg: token, code : 0}
                  res.json(tokenizedMsg)
            } catch (e) {
                console.error(e);
                res.json(Constants.GENERAL_ERROR)
            }
    }
);


  router.post("/getPosts/:email",
  async (req, res) => {
      const email = req.param('email');
          try {
              let posts = await Post.find({email:email})
              allPosts = posts
             res.json(allPosts)
        } catch (e) {
            console.error(e);
            res.json(Constants.GENERAL_ERROR)
      }
    }
);

router.post("/deletePost",
async (req, res) => {
    const {id,email} = req.body;
        try {
            let re = await Post.findByIdAndRemove({_id:  id})
            let user = await User.findOne({email:email})
            let elements = user.posts
            var i = elements.indexOf(id);
            elements.splice(i, 1);
            user.posts = elements;
            user.save()
            res.json("Deleted!")
      } catch (e) {
          console.error(e);
          res.json(Constants.GENERAL_ERROR)
    }
  }

);





router.post("/changeSettings",
async (req, res) => {
    const  {first_name,last_name,password,originEmail} = req.body;
        try {
            let user = await User.findOne({email :originEmail})
            if (first_name !== ''){
              user.first_name = first_name
            }if (last_name !== ''){
              user.last_name = last_name
            }if (password !== ''){
              const salt =  await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(password, salt), (error,hash)=>{
                if (error) res.json(Constants.SIGNUP_ERROR)
            }
          }
          await user.save()
          return res.json(Constants.SAVE_SUCCESS)
      } catch (e) {
          console.error(e);
          return res.json(Constants.GENERAL_ERROR)
    }
  }

);

router.post("/follow",
async (req, res) => {
    const {loggedUser, follow} = req.body
    try {
      let user = await User.findOne({email:loggedUser})
      user.following.push(follow)
      user.save()
      user = await User.findOne({email:follow})
      user.followers.push(loggedUser)
      user.save()
      res.json("followed")
    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.post("/likePost",
async (req, res) => {
    const {user, post_liked} = req.body
    try {
      let post = await Post.findOne({_id: post_liked})
      post.likes.push(user)
      post.likesNum+=1
      await post.save()
      res.json(post)
    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.post("/unlikePost",
async (req, res) => {
    const {user, post_unliked} = req.body
    try {
      let post = await Post.findOne({_id: post_unliked})
      elements = post.likes
      var i = elements.indexOf(user);
      elements.splice(i, 1);
      post.likes = elements;
      post.likesNum-=1
      await post.save()
      res.json(post)
    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.post("/unfollow",
async (req, res) => {
    const {loggedUser, follow} = req.body
    try {
      let user = await User.findOne({email:loggedUser})
      let elements = user.following
      var i = elements.indexOf(follow);
      elements.splice(i, 1);
      user.following = elements;
      user.save()
      // now from the followed user we delete the one who is following from followed section
      user = await User.findOne({email:follow})
      elements = user.followers
      var i = elements.indexOf(loggedUser);
      elements.splice(i, 1);
      user.followers = elements;
      user.save()

    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.post("/removeFollower",
async (req, res) => {
    const {user, remove} = req.body
    try {
      let usr = await User.findOne({email:user})
      let elements = usr.followers
      var i = elements.indexOf(remove);
      elements.splice(i, 1);
      usr.followers = elements;
      let toReturn = elements
      usr.save()
      // delete the following from the user who follows me
      usr = await User.findOne({email:remove})
      elements = usr.following
      var i = elements.indexOf(user);
      elements.splice(i, 1);
      user.following = elements;
      usr.save()
      res.json(toReturn)
    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);


router.get("/isFollowing/:loggedUser/:follow",
async (req, res) => {
    const loggedUser = req.params.loggedUser
    const follow = req.params.follow
    try {
      let user = await User.findOne({email:loggedUser})
      arr = user.following
      if (arr.includes(follow)) {
        res.json(Constants.USER_FOUND)
      } else {
        res.json(Constants.NO_USER_FOUND)
      }
    } catch (e) {
    console.error(e);
    res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.get("/getFollowing/:email",
async (req, res) => {
    const email = req.params.email;
        try {
            let user = await User.findOne({email:email})
            if (!user) res.json(Constants.NO_USER_FOUND)
            var allFollowing = user.following
           res.json(allFollowing)
      } catch (e) {
          console.error(e);
          res.json(Constants.GENERAL_ERROR)
    }
  }
);

router.get("/getFollowers/:email",
async (req, res) => {
    const email = req.params.email;
        try {
            let user = await User.findOne({email:email})
            if (!user) res.json(Constants.NO_USER_FOUND)
            var allFollowing = user.followers
           res.json(allFollowing)
      } catch (e) {
          console.error(e);
          res.json(Constants.GENERAL_ERROR)
    }
  }
);


  router.get("/getPosts/:email",
  async (req, res) => {
      const email = req.params.email
          try {
              let posts = await Post.find({email:email})
              allPosts = posts
             res.json(allPosts)
        } catch (e) {
            console.error(e);
            res.json(Constants.GENERAL_ERROR)
      }
    }
);

router.post("/getFollowingUsersPosts",
async (req, res) => {
    const {following} = req.body;
        try {
          let allPosts = []
          for (var i = 0; i <following.length; i++){
            let posts = await Post.find({email:following[i]})
            for (var k = 0; k<posts.length; k++){
              allPosts.push(posts[k])
            }
            
          }
           res.json(allPosts)
      } catch (e) {
          console.error(e);
          res.json(Constants.GENERAL_ERROR)
    }
  }
);
module.exports = router;


//**********************************************BACK UP FUNCTIONS***************************** */





