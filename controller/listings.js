const Listing = require("../models/listing");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showLiting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file 
    ? req.file.path 
    : "https://static.vecteezy.com/system/resources/thumbnails/071/854/856/small/autumnal-farmhouse-aerial-view-photo.jpeg";
  let filename = req.file ? req.file.filename : "default";

  console.log("req.file:", req.file);
  console.log("Image URL:", url);

  const location = req.body.listing.location;
  const apiKey = process.env.OPENCAGE_API_KEY;

  let coordinates = [77.209, 28.6139];

  try {
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
    const geoData = await geoRes.json();

    if (geoData.results && geoData.results.length > 0) {
      const { lng, lat } = geoData.results[0].geometry;
      coordinates = [lng, lat];
    }
  } catch (err) {
    console.log("Geocoding failed, using default coordinates:", err.message);
  }

  console.log("Coordinates:", coordinates);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = { type: "Point", coordinates };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};