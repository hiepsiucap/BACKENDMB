/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const PotholesSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    district: { type: String, required: true },
    province: { type: String, required: true },
    severity: {
      type: String,
      required: true,
      enum: ["HIGH", "MEDIUM", "LOW"],
    },
    imagePath: {
      type: String,
    },
  },
  { timestamps: true }
);
PotholesSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("PothHoles", PotholesSchema);
