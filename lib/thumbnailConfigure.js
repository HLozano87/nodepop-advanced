import path from "path";
import sharp from "sharp";

export const createThumbnail = async (file) => {
  const { path: inputFilePath, filename, destination } = file
  const ext = path.extname(file.filename).toLocaleLowerCase().trim();
  const baseName = path.basename(filename, ext);

  const outputFilename = `${baseName}-thumbnail${ext}`;
  const outputPath = path.join(destination, outputFilename);

  await sharp(inputFilePath)
    .resize(300, 300)
    .toFile(outputPath);

  return outputFilename;
};