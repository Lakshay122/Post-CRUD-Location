const express = require('express');
const router = express.Router();
var passport = require('passport');
const { createPost, deletePost, updatePost, getPosts, getCountOfActive, getPostsOnLocation } = require('../controller/postController');
const { createPostValidatorMiddleware, updatePostValidatorMiddleware } = require('../middleware/validatorMiddleware');
require('../middleware/passport')(passport)

router.post("/create-post",passport.authenticate('jwt',{session:false}),createPostValidatorMiddleware,createPost)
router.put("/update-post/:id",passport.authenticate('jwt',{session:false}),updatePostValidatorMiddleware,updatePost)
router.delete("/delete-post/:id",passport.authenticate('jwt',{session:false}),deletePost)
router.get("/get-post",passport.authenticate('jwt',{session:false}),getPosts)
router.get("/get-count-active-post",passport.authenticate('jwt',{session:false}),getCountOfActive)
router.post("/get-public-post",getPostsOnLocation)

module.exports = router