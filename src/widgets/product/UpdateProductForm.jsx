import React, { useContext, useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { StoreContext } from "@/context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProductForm = () => {
    const navigate = useNavigate();
    const { Project, data, SetTostMsg, EditProduct } = useContext(StoreContext);

    // State for form data
    const [formData, setFormData] = useState({
        projectid: "",
        name: "",
        desc: "",
        gallery: [{ galleryimage: "", alt: "" }],
        video: "",
        amenties: [{ name: "", amentiimage: "", amentialt: "" }],
        status: null,
        metatitle: "",
        metadesc: "",
        addedby: data.id,
        lasteditby: data.id,
    });

    // Initialize form data with the product to be edited
    useEffect(() => {
        if (EditProduct) {
            const deepCopyEditProduct = JSON.parse(JSON.stringify(EditProduct));

            setFormData({
                projectid: deepCopyEditProduct.projectid || "",
                name: deepCopyEditProduct.name || "",
                desc: deepCopyEditProduct.desc || "",
                gallery: deepCopyEditProduct.gallery || [{ galleryimage: "", alt: "" }],
                video: deepCopyEditProduct.video || "",
                amenties: deepCopyEditProduct.amenties || [{ name: "", amentiimage: "", amentialt: "" }],
                status: deepCopyEditProduct.status || null,
                metatitle: deepCopyEditProduct.metatitle || "",
                metadesc: deepCopyEditProduct.metadesc || "",
                addedby: deepCopyEditProduct.addedby || data.id,
                lasteditby: data.id,
            });
        }
       
    }, [EditProduct, data.id,]);
    console.log(formData)
    console.log(EditProduct)
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Special handling for the "status" field
        if (name === "status") {
            // Convert the string "true" or "false" to a boolean
            setFormData({
                ...formData,
                [name]: value === "true" , // Converts "true" to true and "false" to false
            });
        } else {
            // For all other fields, update the value as-is
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle gallery image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const NewImages = files.map((file) => ({
            galleryimage: file, // Temporary URL
            alt: "", // Initialize alt as empty
        }));

        setFormData((prev) => ({
            ...prev,
            gallery: [
                ...prev.gallery.filter((item) => item.galleryimage !== ""), // Remove empty object
                ...NewImages,
            ],
        }));
    };
    const handleRemoveImage = (index) => {
        // Filter out the specific image by index
        const updatedformGallery = formData.gallery.filter((_, idx) => idx !== index);
        setFormData((prev) => ({
            ...prev,
            gallery: updatedformGallery,
        }));

    };
    const handleAltChange = (index, value) => {
        const updatedGallery = formData.gallery.map((item, idx) => {
            if (idx === index) {
                return { ...item, alt: value }; // Update alt text for specific image
            }
            return item;
        });

        setFormData((prev) => ({
            ...prev,
            gallery: updatedGallery,
        }));
    };

    // Handle amenity input changes
    const handleAmenityChange = (e, index) => {
        const { name, value } = e.target;

        const updateAmenties = [...formData.amenties];
        updateAmenties[index][name] = value;

        setFormData({
            ...formData,
            amenties: updateAmenties,
        });
    };

    const handleImageChangeAmentimg = (e, index) => {
        const file = e.target.files[0];

        if (!file) return;

        const updateAmentiImg = [...formData.amenties];
        updateAmentiImg[index].amentiimage = file;
        setFormData({
            ...formData,
            amenties: updateAmentiImg,
        });
    };

    // Add a new amenity field
    const addAmenity = () => {
        setFormData({
            ...formData,
            amenties: [...formData.amenties, { name: "", amentiimage: "", amentialt: "" }],
        });
    };

    // Remove an amenity
    const removeAmenity = (index) => {
        setFormData((prev) => ({
            ...prev,
            amenties: prev.amenties.filter((_, i) => i !== index),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

             // Step 1: Find images to delete
    const imagesToDelete = EditProduct.gallery.filter(
        (img) =>
            !formData.gallery.some(
                (dltimage) => !(dltimage.galleryimage instanceof File) && dltimage.galleryimage === img.galleryimage
            )
    );

    console.log("EditProduct.amenties:", EditProduct.amenties);
    console.log("formData.amenties:", formData.amenties);
    
    const amenityImagesToDlt = EditProduct.amenties.filter((img) => {
        const isImagePresent = formData.amenties.some((dltimage) => {
            if (dltimage.amentiimage instanceof File) {
                return false; // Skip new images
            }
            return dltimage.amentiimage === img.amentiimage;
        });
    
        console.log(`Image ${img.amentiimage} present in formData:`, isImagePresent);
        return !isImagePresent;
    });
    
    console.log("amenityImagesToDlt:", amenityImagesToDlt);

    console.log(imagesToDelete)
    console.log(amenityImagesToDlt)
  
     // Combine all images to delete
const imagesToDeleteArray = [
    ...imagesToDelete.map((img) => ({ file: img.galleryimage })),
    ...amenityImagesToDlt.map((img) => ({ file: img.amentiimage })),
  
];


        try {

              //      // 1️⃣ **Delete Images First**
        if(imagesToDeleteArray.length > 0){
            console.log(imagesToDeleteArray)
          const response =   await Promise.all(
                imagesToDeleteArray.map(async (file) => {
                    console.log(file)
                   const res =  await axios.delete(`${data.url}/api/admin/upload/product/${file.file}`);
                   console.log(res)
                })
            );

        }
            // Prepare promises for uploading gallery and amenity images
            const galleryImagePromises = formData.gallery.map(async (image) => {
                if (image.galleryimage instanceof File) {
                    const formDataImage = new FormData();
                    formDataImage.append('file', image.galleryimage);

                    const response = await axios.post(`${data.url}/api/admin/upload/product`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return image.galleryimage; // If no file, return the current value (could be URL)
            });

            const AmenityImages = formData.amenties.map(async (amenity) => {
                if (amenity.amentiimage instanceof File) {
                    const formDataImage = new FormData();
                    formDataImage.append('file', amenity.amentiimage);

                    const response = await axios.post(`${data.url}/api/admin/upload/product`, formDataImage, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return amenity.amentiimage; // If no file, return the current value (could be URL)
            });

            // Wait for all image uploads to complete
            const galleryImageUrls = await Promise.all(galleryImagePromises);
            const amentiImages = await Promise.all(AmenityImages);

            // Update sections and gallery with the uploaded image URLs
            const updatedGallery = formData.gallery.map((image, index) => ({
                ...image,
                galleryimage: galleryImageUrls[index] || image.galleryimage,
            }));

            const updatedAmenity = formData.amenties.map((amenity, index) => ({
                ...amenity,
                amentiimage: amentiImages[index] || amenity.amentiimage,
            }));

            // Update formData with the new image URLs
            const updatedFormData = {
                ...formData,
                gallery: updatedGallery,
                amenties: updatedAmenity,
            };

            // Send the updated form data to your API
            const response = await axios.put(`${data.url}/api/admin/product/${EditProduct._id}`, updatedFormData);
            console.log(response);
            if (response.data.success) {
                console.log('Product updated successfully:', response.data);
                SetTostMsg(response.data.message);
                navigate('/dashboard/product');
                // Handle success (e.g., redirect, show success message, etc.)
            } else {
                console.error('Error updating product:', response.data);
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error in form submission:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div>
            <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Update Product</h2>
                <form onSubmit={handleSubmit} className="max-h-[500px] overflow-y-auto">
                    {/* Gallery Images Field */}
                    <div className="space-y-2 mb-4">
                        <Typography variant="small" className="font-medium">
                            Project Image
                        </Typography>
                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                            <input
                                type="file"
                                accept="image/*"
                                multiple // Allow multiple file selection
                                name="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className="text-gray-700">Choose a file</span>
                        </label>
                        {/* Display Image Previews with Alt Inputs */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 ">
                            {formData.gallery.map((image, index) => (
                                <div key={index} className=" flex flex-col  space-y-2 group">
                                    {/* Image */}
                                    {image.galleryimage  ? (
                                        <div>
                                           <div className="relative">
                                           <img
                                             src={image.galleryimage instanceof File ? URL.createObjectURL(image.galleryimage) : `${data.url}/Images/product/${image.galleryimage}`} 
                                                alt={image.alt || "Uploaded image"}
                                                className="h-32 w-full object-cover rounded-lg border"
                                            />
                                            {/* Remove Button (only visible on hover) */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 text-sm text-white bg-red-600 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Remove
                                            </button>
                                           </div>

                                            {/* Alt Text Input */}
                                            <input
                                                type="text"
                                                placeholder="Enter alt text"
                                                name="alt"
                                                value={image.alt}
                                                onChange={(e) => handleAltChange(index, e.target.value)}
                                                className="mt-3 w-full px-2 py-1 border rounded-md"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Field */}
                    <div className="space-y-2 gap-5 mb-4">
                        <label className="block text-sm font-medium text-gray-700">Amenities</label>
                        {formData.amenties.map((amenity, index) => (
                            <div key={index} className="mt-2">
                                <div className="mb-4">
                                    <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple // Allow multiple file selection
                                            name="image"
                                            onChange={(e) => handleImageChangeAmentimg(e, index)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-700">Choose a file</span>
                                    </label>
                                </div>

                                <div className="mb-4">
                                    {/* Image */}
                                    <img
                                        src={amenity.amentiimage instanceof File ? URL.createObjectURL(amenity.amentiimage) :  `${data.url}/Images/product/${amenity.amentiimage}`}
                                        alt={amenity.amentialt || "Uploaded image"}
                                        className="w-20 object-cover rounded-lg border"
                                    />
                                </div>

                                <div className="">
                                    <input
                                        type="text"
                                        name="name"
                                        value={amenity.name}
                                        onChange={(e) => handleAmenityChange(e, index)}
                                        placeholder="Amenity Name"
                                        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />

                                    <input
                                        type="text"
                                        name="amentialt"
                                        value={amenity.amentialt}
                                        onChange={(e) => handleAmenityChange(e, index)}
                                        placeholder="alt"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between">
                                    <div>
                                        <Button
                                            type="Button"
                                            size="small"
                                            onClick={addAmenity}
                                            className="p-2 bg-gray-500 text-white rounded-md mt-4 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                                        >
                                            Add Amenity
                                        </Button>
                                    </div>

                                    <div>
                                        {/* Remove Section Button */}
                                        <Button
                                            size="small"
                                            type="Button"
                                            onClick={() => removeAmenity(index)}
                                            className="p-2 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Project ID Field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Select Project:
                        </label>
                        <select
                            name="projectid"
                            value={formData.projectid}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option value="">Select Project</option>
                            {Project.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Product Status</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="true"
                                    checked={formData.status === true}
                                    onChange={() => setFormData({ ...formData, status: true })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="false"
                                    checked={formData.status === false}
                                    onChange={() => setFormData({ ...formData, status: false })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Video Field */}
                        <div className="mb-4">
                            <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                                Product Video URL
                            </label>
                            <input
                                type="text"
                                id="video"
                                name="video"
                                value={formData.video}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="mb-4">
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                                Product Description
                            </label>
                            <textarea
                                id="desc"
                                name="desc"
                                value={formData.desc}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            ></textarea>
                        </div>

                        {/* Meta Description Field */}
                        <div className="mb-4">
                            <label htmlFor="metadesc" className="block text-sm font-medium text-gray-700">
                                Meta Description
                            </label>
                            <textarea
                                id="metadesc"
                                name="metadesc"
                                value={formData.metadesc}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>

                        {/* Meta Title Field */}
                        <div className="mb-4">
                            <label htmlFor="metatitle" className="block text-sm font-medium text-gray-700">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                id="metatitle"
                                name="metatitle"
                                value={formData.metatitle}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-40 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;