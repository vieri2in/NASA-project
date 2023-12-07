const { getAllPlanets } = require("../../models/planets.model");
const httpGetAllPlanets = async (req, response) => {
  return response.status(200).json(await getAllPlanets());
};
module.exports = {
  httpGetAllPlanets,
};
