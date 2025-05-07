const fs = require('fs');

const promises = async function (data) {
  var promise1 = fetch(`https://dog.ceo/api/breed/${data}/images/random`);
  var promise2 = fetch(`https://dog.ceo/api/breed/${data}/images/random`);
  var promise3 = fetch(`https://dog.ceo/api/breed/${data}/images/random`);
  const response = await Promise.all([promise1, promise2, promise3]);
  console.log('response:' + response);

  const res = await Promise.all(response.map((el) => el.json()));
  console.log('res:' + res);

  const img = res.map((i) => i.message);
  console.log(img);

  fs.writeFile('./dog-image-link', img.join('\n'), (err) => {
    console.log(err);
  });
};

promises('akita');
