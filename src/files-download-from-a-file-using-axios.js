// const axios = require("axios");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const stream = require("stream");

const INPUT_FILE_PATH =
  "/home/aditya/Documents/programs/file-storage-program/inputFile.txt";

async function fileStore(inputFilePath, outputDir) {
  if (!inputFilePath) {
    process.exit(-1);
  }

  if (!outputDir) {
    outputDir = __dirname;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  //   const fileReadHandler = fs.opendirSync(inputFilePath, "r");

  const fileReadStream = fs.createReadStream(inputFilePath);

  const lineFeed = readline.createInterface(fileReadStream);

  lineFeed.on("line", async (fileLink) => {
    const fileNameParsed = fileNameParser(fileLink);
    const outputFilePath = path.join(outputDir, fileNameParsed);

    const response = await fetch(fileLink);
    const responseArrayBuffer = await response.arrayBuffer();
    const responseBuffer = Buffer.from(responseArrayBuffer);

    const responseReadStream = stream.Readable.from([responseBuffer]);
    const fileWriteStream = fs.createWriteStream(outputFilePath);

    responseReadStream.on("data", (chunk) => {
      if (!fileWriteStream.write(chunk)) {
        responseReadStream.pause();
      }
    });

    fileWriteStream.on("drain", () => {
      responseReadStream.resume();
    });

    responseReadStream.on("end", () => {
      console.log("file read complete");
      fileWriteStream.on("end", ()=> {
        console.log("file write ")
      })
    });
  });
}

function fileNameParser(fileLink = "") {
  const fileNameStartIndex = fileLink.lastIndexOf("/");

  const fileName = fileLink.slice(fileNameStartIndex + 1, fileLink.length);

  return fileName;
}

fileStore(INPUT_FILE_PATH);
