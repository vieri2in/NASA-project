const axios = require("axios");
const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();
// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUM = 100;
// const launch = {
//   flightNumber: 100, // flight_number
//   mission: "Mission 1", // name
//   rocket: "Rocket one", // rocket.name
//   launchDate: new Date("December 3, 2023"), //date_local
//   target: "Kepler-1652 b", // not applicable
//   customers: ["ZTM", "NASA"], // payload.customers for each payload
//   upcoming: true, // upcoming
//   success: true, // success
// };
// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);
async function getAllLaunches(skip, limit) {
  return await launchesDB
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({
      flightNumber: 1,
    })
    .skip(skip)
    .limit(limit);
}
async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
  });
  await saveLaunch(newLaunch);
}
// async function addNewLaunch(launch) {
//   // // latestFlightNumber++;
//   // const latestFlightNumber = await getLatestFlightNumber();
//   // launches.set(
//   //   latestFlightNumber,
//   //   Object.assign(launch, {
//   //     customers: ["ZTM", "NASA"],
//   //     flightNumber: latestFlightNumber + 1,
//   //     upcoming: true,
//   //     success: true,
//   //   })
//   // );
// }
async function isLaunchWithIdExisted(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUM;
  }
  return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}
async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.acknowledged && aborted.modifiedCount === 1;
}
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }
  await populateLaunches();
}
async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: { name: 1 },
        },
        {
          path: "payloads",
          select: { customers: 1 },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Downloading launches data failed");
    throw new Error("Downloading launches data failed");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const customers = launchDoc.payloads.flatMap((payload) => {
      return payload.customers;
    });
    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: new Date(launchDoc.date_local),
      customers,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };
    // console.log(`${launch.flightNumber} ${launch.mission} ${launch.customers}`);
    await saveLaunch(launch);
  }
}
module.exports = {
  loadLaunchesData,
  // launches,
  getAllLaunches,
  // addNewLaunch,
  isLaunchWithIdExisted,
  abortLaunchById,
  scheduleNewLaunch,
};
