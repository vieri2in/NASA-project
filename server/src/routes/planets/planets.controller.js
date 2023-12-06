const { getAllPlanets } = require("../../models/planets.model");
const httpGetAllPlanets = (req, response) => {
  return response.status(200).json(getAllPlanets());
};
module.exports = {
  httpGetAllPlanets,
};
