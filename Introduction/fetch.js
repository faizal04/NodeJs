const fs = require('fs');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  if (err) return console.log(err);
  console.log(data.toString());
  data = data.toString();
  fetch(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => res.json())
    .then((json) => {
      console.log(json.message);

      fs.writeFile('dog-image-link', `${json.message}`, (err) => {
        if (err) console.log(err.message);
      });
    });
});
