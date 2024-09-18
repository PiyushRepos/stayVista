const Listing = require("./model/listing.model.js");
const Review = require("./model/review.model.js");
const { reviewSchema, listingSchema } = require("./schema.js");
const ExpressErr = require("./utils/ExpressErr.js");

const validateSchema = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressErr(400, error);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressErr(400, error);
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", `You must be logged in`);
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewOwner = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not owner of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isReviewOwner,
  validateSchema,
  validateReview,
};
