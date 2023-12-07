// const launches = require("./launches.mongo");
const launches = new Map();
let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Mission 1",
  rocket: "Rocket one",
  launchDate: new Date("December 3, 2023"),
  target: "Xerox planet",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};
launches.set(launch.flightNumber, launch);
function getAllLaunches() {
  return Array.from(launches.values());
}
function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
      upcoming: true,
      success: true,
    })
  );
}
function isLaunchWithIdExisted(launchId) {
  return launches.has(launchId);
}
function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}
module.exports = {
  launches,
  getAllLaunches,
  addNewLaunch,
  isLaunchWithIdExisted,
  abortLaunchById,
};
