const fs = require("fs");
const path = require("path");
const readline = require("readline");
const axios = require("axios").default;

const argv = process.argv;

let dirs;
let inStream;
let outStream;

if (argv.length > 2) {
  dirs = extractFileDirsFromArr(argv);

  if (Reflect.has(dirs, "inputFilePath")) {
    const inputFileExist = fs.existsSync(dirs.inputFilePath);
    
    if (!inputFileExist) {
      console.log(
        "Usage : node programFile *<inputFilePath> **<outputFilePath>"
      );
      process.exit(0);
    }
    inStream = fs.createReadStream(dirs.inputFilePath);
  }

  if (Reflect.has(dirs, "outputFilePath")) {
    outStream = fs.createWriteStream(dirs.outputFilePath);
  }

  
  if (typeof inStream === undefined) {
    console.log(
      "Usage : node programFile *${inputFilePath} **${outputFilePath}"
    );
    process.exit(-1);
  }
}

function extractFileDirsFromArr(arr) {
  let inputFilePath;
  let outputFilePath;

  let result = {};

  for (let i = 2; i < arr.length; i++) {
    let count = 0;
    
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === "*") {
        count++;
      }
    }
  
    
    if (count === 1) {

      inputFilePath = arr[i].slice(1, arr[i].length);
      count = 0;
    }
    
    if (count === 2) {
      outputFilePath = arr[i].slice(2, arr[i].length);
      count = 0;
    }
  }
  
  if (inputFilePath) {
    result.inputFilePath = inputFilePath;
  }
  
  if (outputFilePath) {
    result.outputFilePath = outputFilePath;
  }

  return result;
}

// inStream = process.stdin;

// outStream = process.stdout;
