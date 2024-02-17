const fs = require("fs/promises");

(async () => {
  const fileHandle = await fs.open(
    "/home/aditya/Documents/programs/file-storage-program/inputFile.txt",
    "w"
  );

  const writeStream = fileHandle.createWriteStream();

  console.log(writeStream.writableHighWaterMark);
  console.log(writeStream.writableLength)
})();

