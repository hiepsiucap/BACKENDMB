/** @format */

var express = require("express");
var router = express.Router();
const fileUpLoader = require("../utils/CloudinaryCofig");
const {
  CreatePotholes,
  findPothole,
  FindAllPothHole,
  findPothHoleSurrond,
  CreatePotholesWithImage,
  UpdateImagePothole,
  PotholeDeleteAll,
} = require("../controller/PotholesController");
const { authentication } = require("../Middleware/authentication");
router.post("/create", authentication, CreatePotholes);
router.post(
  "/createwithimage",
  authentication,
  fileUpLoader.single("file"),
  CreatePotholesWithImage
);
router.get("/findpothole", authentication, findPothole);
router.get("/findpotholearround", authentication, findPothHoleSurrond);
router.get("/findall", authentication, FindAllPothHole);
router.delete("/deleteall", authentication, PotholeDeleteAll);
router.post(
  "/updateimage",
  authentication,
  fileUpLoader.single("file"),
  UpdateImagePothole
);
module.exports = router;
