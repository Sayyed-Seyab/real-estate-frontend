import { StoreContext } from "@/context/Context";
import { Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateProjectCategory() {
    const { data, SetTostMsg, EditProjectCategory, setEditProjectCategory, Projectparent } = useContext(StoreContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        parentid: "",
        categoryimage: null,
        name: "",
        description: "",
        status: null,
        lasteditby: data.id,
        addedby: data.id,
    });

    const [PreviewImage, setPreviewImage] = useState("");

    // Prefill form if EditProjectCategory is provided
    useEffect(() => {
        if (EditProjectCategory) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                parentid: EditProjectCategory.parentid || "",
                name: EditProjectCategory.name || "",
                description: EditProjectCategory.description || "",
                status: EditProjectCategory.status,
                addedby: EditProjectCategory.addedby || data.id,
                categoryimage: null, // Set null to allow new uploads
            }));

            setPreviewImage(`${data.url}/Images/category/${EditProjectCategory.categoryimage}` || null);
        } else {
            navigate("/dashboard/project-category"); // Redirect if no data is available for editing
        }
    }, [EditProjectCategory, data.url, navigate]);

console.log(formData)
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Updating field:", name, "with value:", value); // Log for debugging
        setFormData({
            ...formData,
            [name]: value === "true" ? true : value === "false" ? false : value,
        });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                categoryimage: file,
            });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Prepare FormData outside the block
        const uploadData = new FormData();
    
        try {
            if (formData.categoryimage instanceof File) {
                console.log("New file selected, handling old image deletion, upload, and category update...");
    
                // Append the file to FormData
                uploadData.append("file", formData.categoryimage);
    
                // Promise for deleting the old image
                const deleteOldImagePromise = axios.delete(
                    `${data.url}/api/admin/upload/category/${EditProjectCategory.categoryimage}`
                );
    
                // Promise for uploading the new image
                const uploadNewImagePromise = axios.post(
                    `${data.url}/api/admin/upload/category`,
                    uploadData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
    
                // Execute promises for delete and upload in parallel
                const [deleteResponse, uploadResponse] = await Promise.all([
                    deleteOldImagePromise,
                    uploadNewImagePromise,
                ]);
    
                // Check results
                if (!deleteResponse.data.success) {
                    toast.error("Failed to delete the old image.");
                    return; // Stop if deletion fails
                }
    
                if (!uploadResponse.data.success) {
                    toast.error("Failed to upload the new image.");
                    return; // Stop if upload fails
                }
    
                console.log("Old image deleted and new image uploaded successfully");
                formData.categoryimage = uploadResponse.data.file; // Update file path in formData
            }
    
            // Update the category
            const updateResponse = await axios.put(
                `${data.url}/api/admin/projectcategory/${EditProjectCategory._id}`,
                {
                    parentid: formData.parentid,
                    categoryimage: formData.categoryimage, // New or existing image path
                    name: formData.name,
                    description: formData.description,
                    status: formData.status,
                    lasteditby: formData.lasteditby,
                    addedby: formData.addedby,
                },
                { headers: { "Content-Type": "application/json" } }
            );
    
            // Check update response
            if (updateResponse.data.success) {
                toast.success("Category updated successfully!");
                setEditProjectCategory(null); // Clear the EditProjectCategory state
                navigate("/dashboard/project-category");
            } else {
                toast.error(updateResponse.data.message);
            }
        } catch (error) {
            console.error("Error during the operation:", error);
            toast.error("An error occurred while updating the category.");
        }
    };
    

    return (
        <div>
            <div className="w-full max-w-4xl m-2 mx-auto bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Update Project Category</h2>
                <form onSubmit={handleSubmit}>
                    {/* Category Image */}
                    <div className="space-y-2 mb-4">
                        <Typography variant="small" className="font-medium">
                            Category Image
                        </Typography>
                        <label className="block w-full p-3 text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none">
                            <input
                                type="file"
                                accept="image/*"
                                name="categoryimage"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className="text-gray-700">Choose a file</span>
                        </label>
                        {PreviewImage && (
                            <img
                                src={PreviewImage}
                                alt="Preview"
                                className="mt-4  w-80 object-cover rounded-lg border"
                            />
                        )}

                        {
                            
                        }
                    </div>

                    {/* Parent ID Dropdown */}
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium mb-2">Select Parent:</label>
                        <select
                            name="parentid"
                            value={formData.parentid || ""}
                            onChange={handleChange}
                            className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring focus:ring-gray-300"
                            required
                        >
                            <option value="" disabled>Select Parent</option>
                            {Projectparent.map((parent) => (
                                <option key={parent._id} value={parent._id}>
                                    {parent.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Name Field */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Category Name
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Category Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>

                    {/* Status Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category Status</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value={true}
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
                                    value={false}
                                    checked={formData.status === false}
                                    onChange={() => setFormData({ ...formData, status: false })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Inactive</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Update Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
