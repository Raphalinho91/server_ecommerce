const AWS = require('aws-sdk');
const fs = require('fs');



AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

const uploadImageToS3 = async function (fileName, filePath) {

    try {
        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: 'ollos',
            Key: fileName,
            Body: fileContent
        };
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (err) {
        return false
    }
}
module.exports = {
    uploadImageToS3
};