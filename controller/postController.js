const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../models/postModel");
const ApiFeatures = require("../utils/apifeature");
const ErrorHandler = require("../utils/errorhandler");

exports.createPost = catchAsyncError(async (req, res, next) => {
  try {
    const post = new Post({
      title: req.body?.title,
      body: req.body?.body,
      active: req.body?.active,
      createdBy: req.user._id,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body?.longitude),
          parseFloat(req.body?.latitude),
        ],
      },
    });
    const postData = await post.save();
    await postData.collection.createIndex({ location: "2dsphere" });

    res.status(201).json({
      success: true,
      message: "Post Created successfully",
      data: postData,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

exports.updatePost = catchAsyncError(async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found"));
    if (post.createdBy != req.user.id)
      return next(
        new ErrorHandler("You Don't have an access to update this post")
      );
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      messgae: "Post Updated Successfully",
      updatedPost: updatedPost,
    });
  } catch (e) {
    return next(new ErrorHandler(e, 400));
  }
});

exports.deletePost = catchAsyncError(async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return next(new ErrorHandler("Post not found"));
    if (post.createdBy != req.user.id)
      return next(
        new ErrorHandler("You Don't have an access to delete this post")
      );
    const updatedPost = await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      messgae: "Post Deleted Successfully",
    });
  } catch (e) {
    return next(new ErrorHandler(e, 400));
  }
});

exports.getPosts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = req.query?.resultPerPage || 10;

  delete req.query.resultPerPage;

  const ApiFeature = new ApiFeatures(
    Post.find({ createdBy: req.user.id }),
    req.query
  )
    .filter()
    .pagination(resultPerPage);

  delete req.query.page;

  req.query.createdBy = req.user.id;
  const count = await Post.countDocuments(req.query);
  const postData = await ApiFeature.query;
  res.status(200).json({ success: true, data: postData, count: count });
});

exports.getCountOfActive = catchAsyncError(async (req, res, next) => {
  const countActive = await Post.countDocuments({
    active: true,
    createdBy: req.user.id,
  });
  const countUnActive = await Post.countDocuments({
    active: false,
    createdBy: req.user.id,
  });

  res
    .status(200)
    .json({ success: true, Active: countActive, UnActive: countUnActive });
});

exports.getPostsOnLocation = catchAsyncError(async (req, res, next) => {
  try {
    if (!req.body.latitude || !req.body.longitude)
      return next(new ErrorHandler("Longitude and latitude is mandatory"));
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const maxDistance = (req.query.maxDistance || 2) * 1000;
    const data = await Post.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          key: "location",
          maxDistance: parseFloat(maxDistance) * 1609,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      postData: data,
    });
  } catch (err) {
    return next(new ErrorHandler(err, 400));
  }
});
