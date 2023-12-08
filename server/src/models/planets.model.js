const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");
// const habitablePlanets = [];
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "../", "../", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);
          await savePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log("Error:", error.message);
        reject(error);
      })
      .on("end", async () => {
        // console.log(
        //   habitablePlanets.map((planet) => {
        //     return planet["keplerName"];
        //   })
        // );
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} planets are found`);
        console.log("Done.");
        resolve();
      });
  });
}
async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`Could not store planet ${error}`);
  }
}
async function getAllPlanets() {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
