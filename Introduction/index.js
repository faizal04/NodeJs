const fs = require('fs');
const http = require('http');
const url = require('url');

//////////////////////////////////////
///File
// synchronous way Blocking Code
// const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
// console.log(textIn);
// console.log("testing this blocking code");

//Asynchronous Code Non Blocking Code

// fs.readFile("./starter/txt/input.txt", "utf-8", (err, data) => {
//   console.log(data);
// });
// console.log("testing Non Blocking Code");

/////////////////////////////////////
/////SERVER
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');

const replacetemplate = function (tempcard, product) {
  let output = tempcard;
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;

  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardHtml = dataObj.map((el) => replacetemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);
  }

  // product
  else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replacetemplate(tempProduct, product);
    res.end(output);
  }

  //api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  }

  //error
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1>PAGE NOT Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('starting the server');
});
