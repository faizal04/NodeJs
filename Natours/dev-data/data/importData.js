const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const app = require('../../app');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DataBase connection successfull'));

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const toursFileData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
);

const importfileData = async () => {
  try {
    await Tour.create(toursFileData);
    console.log('data Successfully registered');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data SuccessFully Deleted you can check it out now');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  importfileData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
