const Listing = require("../model/listing.model.js");
const Review = require("../model/review.model.js");

const handleCreateReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Added");
  res.redirect(`/listings/${id}`);
};

const handleDeleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};

module.exports = {
  handleCreateReview,
  handleDeleteReview,
};
