const path = require('path');
const exiftoolBin = require('dist-exiftool');
const exiftool = require('node-exiftool');
const colors = require('colors');
const fs = require('fs');
const tesseract = require('tesseract.js');
const metaDataModel = require('../model/metadataModel');
const extractDataModel = require('../model/extractDataModel');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

const createMetaData = async (req, res) => {
    try {
        const file = req.file.buffer;
        const fileName = req.file.originalname;

        if (!file || !fileName) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Bad Request: Missing required parameters",
            });
        }

        // File size validation
        const maxFileSize = 5 * 1024 * 1024; // 5 MB

        if (file.length > maxFileSize) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Bad Request: File size exceeds the limit',
            });
        }

        // Check if a file with the same name already exists in the database
        // const existingFile = await extractDataModel.findOne({ fileName });

        // if (existingFile) {
        //     return res.status(400).json({
        //         status: false,
        //         statusCode: 400,
        //         message: 'Bad Request: File with the same name already exists',
        //     });
        // }

        // Generate a dynamic filename with provided extension
        const tempFilePath = path.join(__dirname, `${fileName}`);

        // Write file buffer to a temporary file
        await fs.promises.writeFile(tempFilePath, file);

        // Read metadata from the file buffer
        const metadata = await readMetadata(tempFilePath);

        // Respond with the extracted metadata
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Metadata extracted successfully',
            metadata,
        });
    }
    catch (error) {
        console.error(`Error extracting metadata: ${error}`.bgRed.white);

        res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Failed to extract metadata',
        });
    }
}

const readMetadata = async (filePath) => {
    // Create an Exiftool process
    const ep = new exiftool.ExiftoolProcess(exiftoolBin);

    try {
        // Start the Exiftool process
        await ep.open();

        // Read metadata from the file
        const metadata = await ep.readMetadata(filePath);

        return metadata;
    } finally {
        // Close the Exiftool process
        await ep.close();
    }
};

const createDataFromImage = async (req, res) => {
    try {
        const file = req.file.buffer;
        const fileName = req.file.originalname;

        if (!file || !fileName) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Bad Request: Missing required parameters",
            });
        }

        // File size validation
        const maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (file.length > maxFileSize) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Bad Request: File size exceeds the limit',
            });
        }

        // Check if a file with the same name already exists in the database
        // const existingFile = await extractDataModel.findOne({ fileName });

        // if (existingFile) {
        //     return res.status(400).json({
        //         status: false,
        //         statusCode: 400,
        //         message: 'Bad Request: File with the same name already exists',
        //     });
        // }

        // Generate a dynamic filename with the provided extension
        const tempFilePath = path.join(__dirname, fileName);

        // Write file buffer to a temporary file
        await fs.promises.writeFile(tempFilePath, file);

        // Extract text using Tesseract.js
        const text = await extractText(tempFilePath);

        // Calculate text size
        const size = text.length;

        // Define the public folder path
        const publicFolderPath = path.join(__dirname, '../public');

        // Create the 'public' folder if it doesn't exist
        if (!fs.existsSync(publicFolderPath)) {
            fs.mkdirSync(publicFolderPath);
        }

        // Move the file to the public folder
        const newFilePath = path.join(publicFolderPath, fileName);
        await fs.promises.rename(tempFilePath, newFilePath);

        // Save data to the database
        const extractedData = new extractDataModel({
            fileName,
            text,
            size,
            imageUrl: newFilePath,
        });

        await extractedData.save();

        // Respond with the extracted text and the public URL of the stored image
        const publicImageUrl = path.join('public', fileName);

        // Respond with the extracted text
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Text extracted successfully',
            text,
            size,
            imageUrl: publicImageUrl,
        });
    }
    catch (error) {
        console.error(`Error extracting text: ${error}`.bgRed.white);

        // Cleanup temporary file in case of an error
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Failed to extract text',
        });
    }
}

const extractText = async (filePath) => {
    return new Promise((resolve, reject) => {
        tesseract.recognize(
            filePath,
            'eng',
        ).then(({ data: { text } }) => {
            resolve(text);
        }).catch(err => {
            reject(err);
        });
    });
};

const removeBackgroundImage = async (req, res) => {
    try {
        const file = req.file.buffer;
        const fileName = req.file.originalname;

        if (!file || !fileName) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: "Bad Request: Missing required parameters",
            });
        }

        // Generate a dynamic filename with the provided extension
        const tempFilePath = path.join(__dirname, fileName);

        // Write file buffer to a temporary file
        await fs.promises.writeFile(tempFilePath, file);

        // Define the public folder path
        const outputFolderPath = path.join(__dirname, '../output');

        // Create the 'public' folder if it doesn't exist
        if (!fs.existsSync(outputFolderPath)) {
            fs.mkdirSync(outputFolderPath);
        }

        const outputImagePath = path.join(outputFolderPath, `output_${fileName}`);
        await removeBackground(tempFilePath, outputImagePath);

        const dataURL = `http://localhost:8080/api/v1/metadata/removebg/output/${fileName}`;;

        // Optionally, you can send the dataURL in the response if needed
        res.status(200).send({
            statusCode: 200,
            status: true,
            message: 'Background removed successfully',
            dataURL,
        });
    }
    catch (error) {
        console.error(`Error extracting metadata: ${error}`.bgRed.white);

        res.status(500).json({
            statusCode: 500,
            status: false,
            message: 'Failed to remove background',
        });
    }
}

const removeBackground = async (inputImagePath, outputImagePath) => {
    try {
        // Load the image
        const image = await loadImage(inputImagePath);

        // Create a canvas with the same dimensions as the image
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Loop through each pixel and remove the background
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Assuming a white background (you may need to adjust the values based on your image)
            const isBackground = imageData.data[i] === 255 && imageData.data[i + 1] === 255 && imageData.data[i + 2] === 255;

            if (isBackground) {
                // Set the alpha channel to 0 for background pixels
                imageData.data[i + 3] = 0;
            }
        }

        // Put the modified image data back onto the canvas
        ctx.putImageData(imageData, 0, 0);

        // Save the modified image to the output file
        const buffer = canvas.toBuffer();
        await sharp(buffer).toFile(outputImagePath);

        console.log('Background removed successfully!');
    } catch (error) {
        console.error('Error removing background:', error);
    }
}

module.exports = { createMetaData, createDataFromImage, removeBackgroundImage };
