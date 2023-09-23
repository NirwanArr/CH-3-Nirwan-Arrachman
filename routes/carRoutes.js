const express = require("express");
const carController = require("../controllers/carsController");

const router = express.Router();

router.param("id", carController.checkDataById);

router
  .route("/")
  .get(carController.getAllCars)
  .post(
    carController.checkBody,
    carController.createCarData
  );

router
  .route("/:id")
  .get(carController.getCarById)
  .patch(carController.editCarData)
  .delete(carController.removeCarData);

module.exports = router;
