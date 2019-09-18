const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const vehicles = require("./routes/api/vehicles");
const vehiclesAPI = require("./assets/vehiclesAPI");

const app = express();

// Body parser middlewareD
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use("/api/vehicles", vehicles);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

vehiclesAPI.init();

setInterval(() => {
  vehiclesAPI.getLines();
}, 15 * 1000);
