const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    comment: String,
    rating: {
      type: Number,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
