const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    cost: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: Buffer, // Store binary image data
      contentType: String, // Store the image content type (e.g., 'image/jpeg')
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("food", foodSchema);
