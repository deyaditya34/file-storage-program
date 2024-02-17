const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputFilePath =
  "/home/aditya/Documents/programs/file-storage-program/inputFile.txt";

async function fileStore(inputFilePath, outputDir) {
  if (!outputDir) {
    outputDir = __dirname
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fsReadStream = fs.createReadStream(inputFilePath);

  const linefeed = readline.createInterface(fsReadStream);

  linefeed.on("line", async (fileLink) => {
    const fileNameParsed = fileNameParser(fileLink);
    const outputFilePath = path.join(outputDir, fileNameParsed);

    try {
      const response = await fetch(fileLink);
      const responseArrBuffer = await response.arrayBuffer();
      const responseBuffer = Buffer.from(responseArrBuffer);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileLink}: ${response.statusText}`);
      }
      
      const fsWriteStream = fs.createWriteStream(outputFilePath);
      
      fsWriteStream.write(responseBuffer);

      fsWriteStream.on("finish", () => {
        console.log(`File ${fileNameParsed} saved successfully.`);
      });

      fsWriteStream.on("error", (err) => {
        console.error(`Error saving file ${fileNameParsed}: ${err}`);
      });
    } catch (err) {
      console.error(`Error in fetching file ${fileLink} : ${err.message}`);
    }
  });
}

function fileNameParser(fileLink = "") {
  const fileNameStartIndex = fileLink.lastIndexOf("/");

  const fileName = fileLink.slice(fileNameStartIndex + 1, fileLink.length);

  return fileName;
}

fileStore(
  inputFilePath,
  "/home/aditya/Documents/programs/file-storage-program/outputFiles"
);
