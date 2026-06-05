const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const defaultImageUrl = "https://static.vecteezy.com/system/resources/thumbnails/071/854/856/small/autumnal-farmhouse-aerial-view-photo.jpeg";

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String
  }, 
  price: Number,
  location: String,
  country: String,
  category: {
    type: String, 
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Domes",
      "Boat"
    ],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [77.209, 28.6139]
    }
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews }})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;