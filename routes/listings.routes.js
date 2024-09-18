const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateSchema } = require("../middleware.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const {
  handleShowIndexPage,
  handleCreateListing,
  handleShowCreateListingForm,
  handleListingDeletion,
  handleListingUpdation,
  handleShowListings,
  handleShowEditListingFrom,
} = require("../controllers/listings.controller.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// index route
Router.route("/")
  .get(wrapAsync(handleShowIndexPage))
  // create route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(handleCreateListing)
  );
// create route - form
Router.get("/new", isLoggedIn, handleShowCreateListingForm);

// update route
Router.route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(handleListingUpdation)
  )
  // show route
  .get(wrapAsync(handleShowListings))
  // Delete route
  .delete(isLoggedIn, isOwner, wrapAsync(handleListingDeletion));

// Edit route - form
Router.get("/:id/edit", isLoggedIn, wrapAsync(handleShowEditListingFrom));

module.exports = Router;
