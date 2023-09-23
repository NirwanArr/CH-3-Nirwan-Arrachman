const fs = require("fs");

const cars = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/cars.json`
  )
);

const checkDataById = (req, res, next, val) => {
  const car = cars.find((el) => el.id === val);

  if (!car) {
    return res.status(404).json({
      status: "Failed",
      message: `Data with this ID : ${val} not found`,
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.manufacture || !req.body.plate) {
    return res.status(404).json({
      status: "failed",
      message: "Manufacture or plate required",
    });
  }
  next();
};

// FUNCTION
const getAllCars = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    data: {
      cars,
    },
  });
};

const getCarById = (req, res) => {
  const id = req.params.id;
  const car = cars.find((el) => el.id === id);

  res.status(200).json({
    status: "Success",
    data: {
      car,
    },
  });
};

const createCarData = (req, res) => {
  const newId = cars[cars.length - 1].id + 1;
  const newData = Object.assign(
    { id: newId },
    req.body
  );

  cars.push(newData);
  fs.writeFile(
    `${__dirname}/dev-data/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "Success",
        data: {
          user: newData,
        },
      });
    }
  );
};

const editCarData = (req, res) => {
  const id = req.params.id;

  const dataIndex = cars.findIndex(
    (el) => el.id === id
  );

  cars[dataIndex] = {
    ...cars[dataIndex],
    ...req.body,
  };

  fs.writeFile(
    `${__dirname}/dev-data/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "Success",
        message: `Car with this id ${id} edited`,
        data: {
          car: cars[dataIndex],
        },
      });
    }
  );
};

const removeCarData = (req, res) => {
  const id = req.params.id;

  const dataIndex = cars.findIndex(
    (el) => el.id === id
  );

  cars.splice(dataIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "Success",
        message: "Deleted successfully",
        data: null,
      });
    }
  );
};

module.exports = {
  getAllCars,
  getCarById,
  createCarData,
  editCarData,
  removeCarData,
  checkDataById,
  checkBody,
};
