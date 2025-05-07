//responses using express

const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;

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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.listen(port, () => {
  console.log('server is Starting' + port);
});
