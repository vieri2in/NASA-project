const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");
// const launches = new Map();
// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUM = 100;
// const launch = {
//   flightNumber: 100,
//   mission: "Mission 1",
//   rocket: "Rocket one",
//   launchDate: new Date("December 3, 2023"),
//   target: "Kepler-1652 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };
// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);
async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}
async function scheduleNewLaunch(launch) {
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
  return await launchesDB.findOne({
    flightNumber: launchId,
  });
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUM;
  }
  return latestLaunch.flightNumber;
}
async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet");
  }
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
  console.log(aborted);
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  return aborted.acknowledged && aborted.modifiedCount === 1;
}
module.exports = {
  // launches,
  getAllLaunches,
  // addNewLaunch,
  isLaunchWithIdExisted,
  abortLaunchById,
  scheduleNewLaunch,
};
