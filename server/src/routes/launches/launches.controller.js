const {
  getAllLaunches,
  // addNewLaunch,
  isLaunchWithIdExisted,
  abortLaunchById,
  scheduleNewLaunch,
} = require("../../models/launches.model");
async function httpGetAllLaunches(req, response) {
  return response.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunch(req, response) {
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
  await scheduleNewLaunch(launch);
  console.log(launch);
  return response.status(201).json(launch);
}
async function httpAbortLaunch(req, response) {
  const launchId = Number(req.params.id);
  console.log(launchId);
  if (!(await isLaunchWithIdExisted(launchId))) {
    return response.status(404).json({
      error: "Launch not found",
    });
  } else {
    const abortedLaunch = await abortLaunchById(launchId);
    if (!abortedLaunch) {
      return response.status(400).json({
        error: "Launch not aborted",
      });
    }
    return response.status(200).json({
      ok: true,
    });
  }
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
