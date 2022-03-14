const express = require("express");
const dbo = require("../db/conn");

const recordRoutes = express.Router();

recordRoutes.route("/signifieds").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("signified")
    .find({}).limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.json(result);
      }
    });
});

module.exports = recordRoutes;