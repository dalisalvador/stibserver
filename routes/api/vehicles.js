const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/getVehicules/:numero_lig", (req, res) => {
  axios
    .get(
      `https://opendata-api.stib-mivb.be/OperationMonitoring/4.0/VehiclePositionByLine/${req.params.numero_lig}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer bd52af8f28411e9ea23d92151cc57bcd" //the token is a variable which holds the token
        }
      }
    )
    .then(stibRes => {
      console.log(stibRes.data);
      if (stibRes) return res.json({ success: true, msg: stibRes });
      else return res.status(404).json({ success: false, msg: stibRes });
    })
    .catch(err => {
      return res.json({ success: false, msg: err });
    });
});

module.exports = router;
