const fs = require("fs");
const path = require("path");

const fileLinks = [
  "http://bitsavers.trailing-edge.com/pdf/adevco/LAN_Rover_Management_Guide_1984.pdf",
  "http://bitsavers.trailing-edge.com/pdf/adevco/LAN_Rover_Technical_Guide_1985.pdf",
  "http://bitsavers.trailing-edge.com/pdf/adevco/LAN_Rover_Users_Guide_1985.pdf",
  "http://bitsavers.trailing-edge.com/pdf/adevco/PC_NOS_Doc.pdf",
  "http://bitsavers.trailing-edge.com/pdf/adevco/PC_NOS_Users_Guide_Preliminary.pdf",
];

async function fileStore(fileLinkList, outputDir) {
  fileLinkList.forEach(async (fileLink) => {

    const response = await fetch(fileLink);
    const responseArrBuffer = await response.arrayBuffer();
    const responseBuffer = Buffer.from(responseArrBuffer);

    if (!response.ok) {
      console.log(`Error in fetching the file - ${fileLink}`);
      process.exit(-1);
    }

    if (!outputDir) {
      outputDir = "";
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true})
    }

    const fileNameParsed = fileNameParser(fileLink);
    
    const outputFilePath = path.join(outputDir, fileNameParsed);

    fs.writeFileSync(outputFilePath, responseBuffer);
  });
}

function fileNameParser(fileLink = "") {
  const fileNameStartIndex = fileLink.lastIndexOf("/");

  const fileName = fileLink.slice(fileNameStartIndex + 1, fileLink.length);

  return fileName;
}

fileStore(
  fileLinks,
  "/home/aditya/Documents/programs/file-storage-program/outputFiles"
);
