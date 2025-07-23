import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloudname: process.env.CLOUDINARY_CLOUD_NAME,
    cloudapi: process.env.CLOUDINARY_API_KEY,
    cloud_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localfilepath) => {
    try {
        if(!localfilepath) return null;
       const response = await cloudinary.uploader.upload(localfilepath, {
        resource_type : "auto"
    });
    fs.unlink(localfilepath);
    return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}

export { uploadOnCloudinary }