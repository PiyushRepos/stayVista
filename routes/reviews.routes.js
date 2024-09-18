const express = require("express");
const Router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.model.js");
const Review = require("../model/review.model.js");
const {
  isLoggedIn,
  isReviewOwner,
  validateReview,
} = require("../middleware.js");
const {
  handleCreateReview,
  handleDeleteReview,
} = require("../controllers/reviews.controller.js");

// create review route
Router.post("/", isLoggedIn, validateReview, wrapAsync(handleCreateReview));

// delete review route
Router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(handleDeleteReview)
);

module.exports = Router;
