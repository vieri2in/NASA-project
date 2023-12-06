const {
  getAllLaunches,
  addNewLaunch,
  isLaunchWithIdExisted,
  abortLaunchById,
} = require("../../models/launchs.model");
function httpGetAllLaunches(req, response) {
  return response.status(200).json(getAllLaunches());
}
function httpAddNewLaunch(req, response) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return response.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return response.status(400).json({
      error: "Invalid launch date",
    });
  }
  addNewLaunch(launch);
  return response.status(201).json(launch);
}
function httpAbortLaunch(req, response) {
  const launchId = Number(req.params.id);
  console.log(launchId);
  if (!isLaunchWithIdExisted(launchId)) {
    return response.status(404).json({
      error: "Launch not found",
    });
  } else {
    const abortedLaunch = abortLaunchById(launchId);
    return response.status(200).json(abortedLaunch);
  }
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
