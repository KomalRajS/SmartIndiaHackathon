const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const RescueSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    username: {
      type: String,
      require: true,
    },

    address: String,
    description: String,

    rest: {
      geometry: {
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
      capacity: {
        type: Number,
        require: true,
      },
      services: [
        {
          type: [String],
          enum: [
            "counseling",
            "food and water",
            "language assistance",
            "medical",
            "transportation",
          ],
          require: true,
        },
      ],
      availability: [
        {
          type: [String],
          enum: ["almost full", "available", "full", "temporarily unavailable"],
        },
      ],
      specialization: [
        {
          type: [String],
          enum: [
            "fire response",
            "medical",
            "mental health support",
            "search and rescue",
            "water rescue",
          ],
        },
      ],
      medical_facility: [
        {
          type: [String],
          enum: [
            "basic first aid",
            "intensive care units",
            "pediatric care",
            "surgical facilities",
            "trauma care",
          ],
        },
      ],
      supply_and_resource: [
        {
          type: [String],
          enum: [
            "limited supplies",
            "medical equipment available",
            "pharmaceuticals available",
            "well-stocked",
          ],
        },
      ],
      calamities: [
        {
          type: [String],
          enum: [
            "earthquake",
            "fire",
            "flood",
            "hurricane",
            "pandemic",
            "tsunami",
          ],
        },
      ],
    },
    contact: {
      country_code: {
        type: String,
        require: true,
      },
      phone_no: {
        type: String,
        require: true,
        unique: true,
      },
    },
  },
  { timestamps: true }
);

RescueSchema.plugin(passportLocalMongoose);
RescueSchema.index({ "rest.geometry.coordinates": "2dsphere" });
module.exports = mongoose.model("Rescuer", RescueSchema);
