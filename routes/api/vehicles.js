const express = require("express");
const router = express.Router();
const axios = require("axios");
const vehiclesAPI = require("../../assets/vehiclesAPI");

router.get("/getVehicules", (req, res) => {
  console.log(" *** Vehicules info requested. *** ");
  if (vehiclesAPI.data)
    return res.json({ success: true, msg: vehiclesAPI.data });
  else return res.json({ success: false, msg: "Information not available" });
});

module.exports = router;
