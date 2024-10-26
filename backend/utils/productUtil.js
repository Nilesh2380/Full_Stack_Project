const axios = require('axios');
const FormData = require('form-data');

exports.uploadImageToImgBB = async (image) => {
    try {
        const apiKey = process.env.IMGBB_API_KEY;

        // Create FormData instance
        const form = new FormData();
        form.append('image', image);

        // Make the request to ImgBB
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // Log response for debugging
        console.log('Response data:', response.data);

        // Check if upload was successful
        if (response.data.success) {
            console.log('Image uploaded successfully:', response.data.data.url);
            return {
                image_Url: response.data.data.url,
                delete_Image_Url: response.data.data.delete_url,
            };
        } else {
            console.error('Image upload failed:', response.data.error.message);
            throw new Error('Image upload failed: ' + response.data.error.message);
        }
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw new Error('Error uploading image: ' + error.message);
    };
};

exports.deleteImageFromImgBB = async (deleteUrl) => {
    try {
        const response = await axios.get(deleteUrl);

        if (response.status === 200) {
            console.log('Image deleted successfully.');
            return response.status;
        } else {
            console.error('Failed to delete image:', response.status);
            return response.status;
        };
    } catch (error) {
        console.error('Error deleting image:', error.message);
    };
};