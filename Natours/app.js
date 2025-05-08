//responses using express

const express = require('express');
const app = express();
const fs = require('fs');

const port = 3000;
app.use(express.json());
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "hellow world from server side", app: "natours" });
// });

// app.post("/", (req, res) => {
//   res.send("hellow post request from server EXPRESS ");
// });

///////////////////// APi Creation of Tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

const GetAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

const GetTour = (req, res) => {
  // console.log(req.params);

  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const DeleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
const UpdateTour = (req, res) => {
  console.log(req.params);
  if (req.params.id * 1 > tours.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour here..>',
    },
  });
};
const CreateTour = (req, res) => {
  const newTour = req.body;
  tours.push(Object.assign({ id: tours.length }, newTour));
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) throw new Error('Data could not be submitted');
    },
  );
  res.send('Data Added Successfully');
};

// app.get('/api/v1/tours', GetAllTours);
// app.get('/api/v1/tours/:id', GetTour);
// app.post('/api/v1/tours', CreateTour);
// app.patch('/api/v1/tours/:id', UpdateTour);
// app.delete('/api/v1/tours/:id', DeleteTour);

app.route('/api/v1/tours').get(GetAllTours).post(CreateTour);

app
  .route('/api/v1/tours/:id')
  .get(GetTour)
  .patch(UpdateTour)
  .delete(DeleteTour);
app.listen(port, () => {
  console.log('server is Starting' + port);
});
