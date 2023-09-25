
import Responses from '@lib/common/API_Responses';
import S3 from '@lib/common/s3';
import jimp from 'jimp';


export default async (event) => {
    const { Records } = event;

    try {
        const promArray = Records.map(record => {
            const bucket = process.env.BUCKET_NAME;
            const file = record.s3.object.key;
            const width = 50;
            const height = 50;
            return resizeImage({ bucket, file, width, height });
        });

        await Promise.all(promArray);

        return Responses._200();
    } catch (error) {
        console.log('error in try catch', error);
        return Responses._400();
    }
};

const resizeImage = async ({ bucket, file, width, height }) => {
    const imageBuffer = await S3.get(file, bucket);
    const jimpImage = await jimp.read(imageBuffer.Body);
    const mime = jimpImage.getMIME();

    const resizedImageBuffer = await jimpImage.scaleToFit(width, height).getBufferAsync(mime);

    const shortFileName = file.split('/')[1];
    const newFileName = `processed/${shortFileName}`;
// ${width}x${height}/
    await S3.write(resizedImageBuffer, newFileName, bucket,mime);
    return newFileName;
};