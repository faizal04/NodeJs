const fs = require('fs');
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('file not found');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, imageLink) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, imageLink, (err) => {
      if (err) reject('new file cant be created');
      else resolve('file finally created you can check it out');
    });
  });
};

readFilePromise('./dog.txt')
  .then((data) => fetch(`https://dog.ceo/api/breed/${data}/images/random`))
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    return writeFilePromise('./dog-image-link', json.message);
  })
  .then((response) => {
    console.log(response);
  })
  .catch((err) => console.log(err.message));
