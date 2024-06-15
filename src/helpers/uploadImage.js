import { v2 as cloudinary } from "cloudinary";
import path from 'path'
import multer from "multer"
;

const options = {
	use_filename: true,
	unique_filename: false,
	overwrite: true,
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads/"));
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // set the file name
  }
})


const upload = multer({ storage: storage });


const uploadImage = async (imagePath) => {
   
	try {
		const response = await cloudinary.uploader.upload(imagePath, options);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
	}
};


export {
   uploadImage, upload
}