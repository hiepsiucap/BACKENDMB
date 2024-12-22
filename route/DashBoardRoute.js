/** @format */

var express = require("express");
var router = express.Router();
const {
  GetAllPothole,
  getDashBoard,
} = require("../controller/PotholesController");
const { authentication } = require("../Middleware/authentication");

router.get("/getallpothole", authentication, GetAllPothole);
router.get("/getDashBoard", authentication, getDashBoard);
module.exports = router;
