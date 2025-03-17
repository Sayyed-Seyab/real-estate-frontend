import React, { useContext, useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { StoreContext } from "@/context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

const AddProductPlan = () => {
    const navigate = useNavigate();
    const { Project, Token, data, GetDetailProjectData, SetTostMsg, ProjectProduct, GetProjectProduct, Isloading, setIsloading } = useContext(StoreContext);

    // State for form data
    const [formData, setFormData] = useState({
        type: "",
        projectid: "",
        name: "",
        desc: "",
        gallery: [{ galleryimage: "", alt: "" }],
        video: "",
        plans: [{ name: "", desc: "" }],
        file: "",
        status: null,
        metatitle: "",
        metadesc: "",
        addedby: data.id,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

    // Handle area input changes
    const handleAreaChange = (e, index) => {
        const { name, value } = e.target;

        const updatedArea = [...formData.plans]
        updatedArea[index][name] = value

        setFormData({
            ...formData,
            plans: updatedArea,
        });
    };

    // Add a new area field
    const addArea = () => {
        setFormData({
            ...formData,
            plans: [...formData.plans, { name: "", desc: "" }],
        });
    };

    // Remove an area
    const removeArea = (index) => {
        setFormData((prev) => ({
            ...prev,
            plans: prev.plans.filter((_, i) => i !== index),
        }));
    };

    const handleRemoveImage = (index) => {
        const updateGallery = formData.gallery.filter((_, idx) => idx !== index)

        setFormData((prev) => ({
            ...prev,
            gallery: updateGallery
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
     setIsloading(true)

        try {
            // Prepare promises for uploading gallery images
            const GalleryImagetoUpload = formData.gallery.map(async (img, index) => {
                if (img.galleryimage instanceof File) {
                    const newImage = new FormData();
                    newImage.append('file', img.galleryimage)
                    const response = await axios.post(
                        `${data.url}/api/admin/upload/productplan`,
                        newImage,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                 Authorization: `Bearer ${Token}`,
                            },
                        });
                    return response.data.file; // Assuming the response contains the uploaded image URL
                }
                return img.galleryimage; // If no file, return the current value (could be URL)
            })





            // Wait for all image uploads to complete
            const galleryImageUrls = await Promise.all(GalleryImagetoUpload);

            // Update gallery with the uploaded image URLs
            const updatedGallery = formData.gallery.map((img, index) => ({
                ...img,
                galleryimage: galleryImageUrls[index] || img.galleryimage
            }))
            // Update formData with the new image URLs
            const updatedFormData = {
                ...formData,
                gallery: updatedGallery,
            };

            // Send the updated form data to your API
            const response = await axios.post(
                `${data.url}/api/admin/productplan`,
                updatedFormData , {
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            }
            );
            console.log(response);
            if (response.data.success) {
                console.log("Product added successfully:", response.data);
                SetTostMsg(response.data.message);
                navigate("/dashboard/productplans");
                setIsloading(false)
            } else {
                toast.error(response.data.message)
                console.error("Error adding product:", response.data);
                 setIsloading(false)
            }
        } catch (error) {
            console.error("Error in form submission:", error);
            toast.error('error occured')
             setIsloading(false)
        }
    };




    useEffect(() => {
        GetProjectProduct();
        GetDetailProjectData()
        console.log(ProjectProduct)
        console.log(formData)
    }, [formData])

    // Handle File Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        const fileData = new FormData();
        fileData.append("file", file);

        try {
            const response = await axios.post(`${data.url}/api/admin/upload/productplan`, fileData, {
                headers: {
                  
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                const fileUrl = response.data.file; // Get uploaded file URL

                setFormData((prevData) => ({
                    ...prevData,
                    file: fileUrl, // Store file URL in formData.file
                }));

                toast.success("File uploaded successfully!");
                console.log("Uploaded File URL:", fileUrl);
            } else {
                toast.error("File upload failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading file.");
        }
    };


    const handleDeleteFile = async () => {
        if (!formData.file) {
            alert("No file to delete");
            return;
        }

        try {
            const response = await axios.delete(`${data.url}/api/admin/upload/productplan/${formData.file}`, {
                headers: {
                   
                     Authorization: `Bearer ${Token}`
                },
                withCredentials: true, // Enable credentials
            });

            if (response.data.success) {
                setFormData((prev) => ({ ...prev, file: "" })); // Remove file from formData
                alert("File deleted successfully!");
            } else {
                alert("Error deleting file");
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Error deleting file");
        }
    };


    return (
        <div>
            { Isloading ? (
                <Loader/>
            ):(
 <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Add Plan</h2>
                <form onSubmit={handleSubmit} className="max-h-[500px] overflow-y-auto">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload file (Optional)
                        </label>
                        {/* File Upload Input */}
                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                            <input
                                type="file"
                                accept=".pdf,.txt,.doc,.docx" // Restrict file types
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <span className="text-gray-700">Upload File (PDF)</span>
                        </label>
                        {/* Show uploaded file URL */}
                        {formData.file && (
                            <div className="mt-4">
                                <p className="text-green-600 font-medium">File Uploaded:</p>
                                <a href={`${data.url}/Files/${formData.file}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {formData.file}
                                </a>
                                {/* Delete File Button */}
                                <button
                                    onClick={handleDeleteFile}
                                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Gallery Images Field */}
                    <div className="space-y-2 mb-4 mt-4">
                        <Typography variant="small" className="font-medium">
                            Gallery Images*
                        </Typography>
                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                name="image"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className="text-gray-700">Choose a file</span>
                        </label>
                        {/* Display Image Previews with Alt Inputs */}
                        <div className="grid grid-cols-2 sm:grid-cols-3  gap-2">
                            {formData.gallery.map((image, index) => (
                                <div
                                    key={index}
                                    className=" flex flex-wrap gap-2space-y-2 group"
                                >
                                    {/* Image */}
                                    {image.galleryimage instanceof File ? (
                                        <div>
                                            <div className="relative">
                                                <img
                                                    src={URL.createObjectURL(image.galleryimage)}
                                                    alt={image.alt || "Uploaded image"}
                                                    className="h-32 w-60 object-cover rounded-lg border"
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
                                                className="mt-2 w-full px-2 py-1 border rounded-md"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>




                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Select Type*:
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option value="" >
                                Select Type
                            </option>
                            <option value="Floor plan">Floor plan</option>
                            <option value="Master plan">Master plan</option>
                        </select>
                    </div>

                    
                     {/* Project ID Field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Select Project*:
                        </label>
                        <select
                            name="projectid"
                            value={formData.projectid}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option value="" >
                                Select Project
                            </option>
                            {Project.map((p) => (
                                <option key={p._id} value={p._id} >
                                    {p.name}
                                </option>
                            ))}


                        </select>
                    </div>






                    {/* Name Field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Plan Name*
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

                    {/* Description Field */}
                    <div className="mb-4">
                        <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
                            Plan Description*
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



                    {/* Video Field */}
                    <div className="mb-4">
                        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                             Plan Video URL
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

                    {/* Area Field */}
                   <div className="space-y-2 gap-5 mb-4">
    <label className="block text-sm font-medium text-gray-700">Plan Areas*</label>
    {formData.plans.map((area, index) => (
        <div key={index} className="mt-2">
            <div className="">
                <input
                    type="text"
                    name="name"
                    value={area.name}
                    onChange={(e) => handleAreaChange(e, index)}
                    placeholder={formData.type === 'Product plan' ? 'Plan Area type' : "title"}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div className="">
                <input
                    type="text"
                    name="desc"
                    value={area.desc}
                    onChange={(e) => handleAreaChange(e, index)}
                    placeholder={formData.type === 'Product plan' ? 'Plan Area value' : 'sub title'}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
                <div>
                    <Button
                        type="button"
                        size="small"
                        onClick={addArea}
                        className="p-2 bg-gray-500 text-white rounded-md mt-4 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                    >
                        {formData.type === 'Product plan' ? 'Add Area' : 'Add Point'}
                    </Button>
                </div>

               {index > 0 ? ( 
    <div>
        {/* Remove Section Button */}
        <Button
            size="small"
            type="button"
            onClick={() => removeArea(index)}
            className="p-2 bg-red-500 text-white rounded-md mt-4 hover:bg-red-600 focus:ring-2 focus:ring-red-500"
        >
            Remove
        </Button>
    </div>
) : null}

            </div>
        </div>
    ))}
</div>

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Plan Status* </label>
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

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-40 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            )}
           
        </div>
    );
};

export default AddProductPlan;