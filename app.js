const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = process.env.port || 3000;

const cars = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/cars.json`
  )
);

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

  if (!car) {
    return res.status(404).json({
      status: "failed",
      message: `Data dengan ${id} tidak ditemukan`,
    });
  }

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

  if (dataIndex === -1) {
    return res.status(404).json({
      status: "Failed",
      message: `Data dengan ${id} tidak ditemukan`,
    });
  }

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
        message: `User dengan id : ${id} berhasil di edit`,
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

  if (dataIndex === -1) {
    return res.status(404).json({
      status: "Failed",
      message: "Data tidak ditemukan",
    });
  }

  cars.splice(dataIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "Success",
        message: "Berhasil delete data",
        data: null,
      });
    }
  );
};

// ROUTES
const carRouter = express.Router();

carRouter
  .route("/")
  .get(getAllCars)
  .post(createCarData);

carRouter
  .route("/:id")
  .get(getCarById)
  .patch(editCarData)
  .delete(removeCarData);

app.use("/api/v1/cars", carRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
