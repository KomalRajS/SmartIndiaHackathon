if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.MONGODB_URL;
const mongoose = require("mongoose");
const User = require("./models/user");
const Rescuer = require("./models/rescue");

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database conected");
});

const populator = async () => {
  for (let i = 0; i < 100; i++) {
    let rescuer = new Rescuer({
      email: "whatsup@gmail.com" + Math.random(),
      username: "nothing" + Math.random(),
      description: "oh my good",
      address: "bangalotre",

      rest: {
        geometry: {
          type: "Point",
          coordinates: getRandomCoordinatesIndia(),
        },
        capacity: 193,
        services: ["counseling", "food and water"],
        availability: ["almost full"],
        specialization: ["fire response", "medical"],

        medical_facility: [
          "basic first aid",
          "intensive care units",
          "pediatric care",
        ],

        supply_and_resource: [
          "limited supplies",
          "medical equipment available",
          "pharmaceuticals available",
          "well-stocked",
        ],

        calamities: ["earthquake", "fire"],
      },

      contact: {
        country_code: "+91",
        phone_no: "90232365376" + Math.random(),
      },
    });

    await rescuer.save();
  }
};

function getRandomCoordinatesIndia() {
  // Define the latitude and longitude boundaries for India
  const minLatitude = 11.6;
  const maxLatitude = 17.6;
  const minLongitude = 74.1;
  const maxLongitude = 78.6;

  // Generate random latitude and longitude coordinates
  const randomLatitude =
    Math.random() * (maxLatitude - minLatitude) + minLatitude;
  const randomLongitude =
    Math.random() * (maxLongitude - minLongitude) + minLongitude;

  // Return the random coordinates as an object
  return [randomLatitude, randomLongitude];
}

const Userpopulator = async () => {
  await User.deleteMany({ rescue_team: "65004c2351045558fcac75f0" });
  for (let i = 0; i < 5; i++) {
    let user = new User({
      email: "whatsup@gmail.com" + Math.random(),
      username: "nothing" + Math.random(),
      rescue_team: "65004c2351045558fcac75f0",
      contact: {
        country_code: "+91",
        phone_no: "90232365376" + Math.random(),
      },
    });

    await user.save();
  }
};

Userpopulator();
