const fs = require("fs");

// synchronous way Blocking Code
const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
console.log(textIn);
console.log("testing this blocking code");

//Asynchronous Code Non Blocking Code

fs.readFile("./starter/txt/input.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("testing Non Blocking Code");
