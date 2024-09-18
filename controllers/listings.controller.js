const Listing = require("../model/listing.model.js");
const axios = require("axios");

// Index page
const handleShowIndexPage = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings, who: "Home" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Create Listing
const handleCreateListing = async (req, res, next) => {
  let { location } = req.body.listing;
  const mapToken = process.env.MAP_API_KEY;
  const { path, filename } = req.file;
  const listing = await new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { url: path, filename };

  await axios
    .get(`https://api.maptiler.com/geocoding/${location}.json?key=${mapToken}`)
    .then((response) => {
      listing.geometry = response.data.features[0].geometry;
    })
    .catch((err) => {
      next(err);
    });

  await listing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// Show Create Listing Form
const handleShowCreateListingForm = (req, res) => {
  res.render("listings/new.ejs", { who: "New" });
};

// Delete Listing
const handleListingDeletion = async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

// Update Listing
const handleListingUpdation = async (req, res) => {
  const id = req.params.id;
  let { location } = req.body.listing;
  const mapToken = process.env.MAP_API_KEY;

  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);

  await axios
    .get(`https://api.maptiler.com/geocoding/${location}.json?key=${mapToken}`)
    .then((response) => {
      updatedListing.geometry = response.data.features[0].geometry;
    })
    .catch((err) => {
      next(err);
    });

  await updatedListing.save();

  if (typeof req.file !== "undefined") {
    const { path, filename } = req.file;
    updatedListing.image = { url: path, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// Show Individual Listings - Show Listing Page
const handleShowListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, who: listing.title });
};

// Show Edit Listing Form
const handleShowEditListingFrom = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("upload/", "upload/w_250/q_50/");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, who: "Edit", originalUrl });
};

module.exports = {
  handleShowIndexPage,
  handleCreateListing,
  handleShowCreateListingForm,
  handleListingDeletion,
  handleListingUpdation,
  handleShowListings,
  handleShowEditListingFrom,
};
