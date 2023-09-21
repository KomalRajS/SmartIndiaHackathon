const User = require("../models/user");
const Rescuer = require("../models/rescue");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

module.exports.chatHandler = async (req, res) => {
  if (
    req.body.queryResult.intent.name ===
    "projects/disaster-emdq/agent/intents/fdcf26e9-0402-456a-8b6c-512dbb70284f"
  ) {
    let userReq = {};
    for (let i = 0; i < req.body.queryResult.outputContexts.length; i++)
      userReq = {
        ...userReq,
        ...req.body.queryResult.outputContexts[i].parameters,
      };
    let severity = [];
    if (userReq.medint.length == 1 && userReq.medint[0] == "basic first aid")
      severity = ["low"];
    else if (
      userReq.medint.length > 1 &&
      userReq.medint[0].includes("basic first aid")
    )
      severity = ["medium"];
    else severity = ["high"];

    let capacity = [];
    if (severity[0] == "high") capacity = ["large"];
    else if (severity[0] == "medium") capacity = ["medium"];
    else capacity = ["small"];

    let specialization = ["medical"];
    if (
      userReq["dis-ent"].includes("flood") ||
      userReq["dis-ent"].includes("tsunami")
    )
      specialization.push("search and Rescuer", "water Rescuer");
    if (userReq["dis-ent"].includes("fire"))
      specialization.push("fire response");

    const userData = {
      id: `${uuidv4()}`,
      Location: {
        lat: 12.9794048,
        long: 77.594624,
      },
      Severity: severity,
      Capacity: capacity,
      Services: userReq.service,
      Availability: ["available"],
      Specialization: specialization,
      Medical_Facility: userReq.medint,
      Supply_and_Resource: [
        "medical equipment available",
        "pharmaceuticals available",
        "well-stocked",
      ],
      calamities: userReq["dis-ent"],
    };
    let allRescueCentersData = await getNearbyCenters(req.session.location);
    allRescueCentersData = allRescueCentersData.map((e) => {
      return {
        id: e._id,
        Location: {
          lat: e.rest.geometry.coordinates[0],
          long: e.rest.geometry.coordinates[1],
        },
        Severity: ["high"],
        Capacity: ["small", "large", "medium"],
        Services: e.rest.services,
        Availability: e.rest.availability,
        Specialization: e.rest.specialization,
        Medical_Facility: e.rest.medical_facility,
        Supply_and_Resource: e.rest.supply_and_resource,
        calamities: e.rest.calamities,
      };
    });
    const rescueId = await findRescueCenter(userData, allRescueCentersData);
  }

  res.status(200).send("");
};

const getNearbyCenters = async (loc) => {
  const queryResult = await Rescuer.find({
    "rest.geometry.coordinates": {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [12.9794048, 77.594624],
        },
        $maxDistance: 100000,
      },
    },
  });
  return queryResult;
};

const findRescueCenter = async (userData, rescueCenterData) => {
  const data = { user: userData, all_data: rescueCenterData };
  const url = "https://recommmendation-engine-sih.onrender.com/predict";
  axios
    .post(url, data)
    .then((response) => {
      console.log(response.data.message[0]);
    })
    .catch((error) => {
      console.error(error);
    });

  return response.data.message[0];
};
