const axios = require("axios");
const allStops = require("./stops.json");

const key1 = process.env.KEY1;
const key2 = process.env.KEY2;

const vehiclesAPI = {
  chunkArray: (myArray, chunk_size) => {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  },

  init: () => {
    let allLines = allStops.features.map(feature => {
      return feature.properties.numero_lig;
    });
    vehiclesAPI.lines = [...new Set(allLines)];
  },

  requestVehiclesPosition: chunks => {
    //chunks of 10 lines
    return chunks.map(lines => {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `https://opendata-api.stib-mivb.be/OperationMonitoring/4.0/VehiclePositionByLine/${lines.join(
              "%2C"
            )}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${key1}`
              }
            }
          )
          .then(stibRes => {
            if (stibRes) {
              console.log("Response from STIB received!");
              resolve(stibRes.data);
            } else {
              reject("Some error ?");
            }
          })
          .catch(err => {
            console.log("****** ERROR !! ******");
            console.log(
              "Error Code (key1): ",
              err.code || err.request.res.statusCode
            );
            if (err.request)
              if (err.request.res.statusCode === 429) {
                //too many requests => use key2
                console.log("Requesting using KEY2");
                axios
                  .get(
                    `https://opendata-api.stib-mivb.be/OperationMonitoring/4.0/VehiclePositionByLine/${lines.join(
                      "%2C"
                    )}`,
                    {
                      headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${key2}`
                      }
                    }
                  )
                  .then(stibRes => {
                    if (stibRes) {
                      console.log("Response from STIB received!");
                      resolve(stibRes.data);
                    } else {
                      reject("Some error ?");
                    }
                  })
                  .catch(err => {
                    console.log("****** ERROR !! ******");
                    console.log(
                      "Error Code (key2): ",
                      err.code || err.request.res.statusCode
                    );
                    if (err.request)
                      if (err.request.res.statusCode === 429) {
                        //too many requests => use key2
                        console.log("Should use the other key");
                      }
                  });
              }
          });
      });
    });
  },

  getLines: async () => {
    let chunks = vehiclesAPI.chunkArray([...vehiclesAPI.lines], 10); //create a new array otherwise I'll destroy original array
    let responses = await vehiclesAPI.requestVehiclesPosition(chunks);
    Promise.all(responses).then(res => {
      vehiclesAPI.data = res.reduce((a, b) => {
        if (a.lines) return a.lines.concat(b.lines);
        else return a.concat(b.lines);
      });
    });
  }
};

module.exports = vehiclesAPI;
