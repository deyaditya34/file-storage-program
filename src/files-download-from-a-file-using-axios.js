const axios = require("axios").default;
const fs = require("fs");
const path = require("path");
const readline = require("readline");

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

  const fileReadStream = fs.createReadStream(inputFilePath);

  const lineFeed = readline.createInterface(fileReadStream);

  lineFeed.on("line", async (fileLink) => {
    const fileNameParsed = fileNameParser(fileLink);
    const outputFilePath = path.join(outputDir, fileNameParsed);
    
    const response = await axios.get(fileLink, {responseType: "stream"})
    const fsWriteStream = fs.createWriteStream(outputFilePath);

    response.data.pipe(fsWriteStream)  

  });
}


function fileNameParser(fileLink = "") {
  const fileNameStartIndex = fileLink.lastIndexOf("/");

  const fileName = fileLink.slice(fileNameStartIndex + 1, fileLink.length);

  return fileName;
}

fileStore(INPUT_FILE_PATH);
